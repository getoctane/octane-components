import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { components } from 'apiTypes';
import { PricePlanCard } from 'components/PricePlanCard';
import { getPricePlans, getCustomerActiveSubscription } from 'utils/api';

export type PricePlan = components['schemas']['PricePlan'];
export type MeteredComponent = components['schemas']['MeteredComponent'];
interface PricePlanManagerProps {
  /**
   * Only show price plans that have these tags
   */
  pricePlanTags?: string[];
  /**
   * Only show price plans with these names
   */
  pricePlanNames?: string[];
}

export interface PlanPickerProps extends PricePlanManagerProps {
  /**
   * An API token with permissions for a specific customer.
   */
  customerToken: string;
  /**
   * The name of the customer to update the subscription for.
   */
  customerName: string;
}

const TokenContext = React.createContext<{
  token: string;
  customerName: string;
}>({
  token: 'NO_TOKEN',
  customerName: 'NO_CUSTOMER',
});

type LoadingState =
  // Loading has started, but it's too soon to show a loading state
  | 'preload'
  // It's taken some time, show a loading state
  | 'loading'
  // The component has all the data it needs
  | 'loaded';

function PricePlanManager({
  pricePlanTags,
  pricePlanNames,
}: PricePlanManagerProps): JSX.Element {
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<LoadingState>('preload');

  const { token, customerName } = useContext(TokenContext);

  useEffect(() => {
    // Get all price plans
    const pricePlans = async (): Promise<void> => {
      const result = await getPricePlans({
        token,
        params: {
          ...(pricePlanTags && { tags: pricePlanTags?.join(',') }),
          ...(pricePlanNames && { names: pricePlanNames?.join(',') }),
        },
      });
      if (!result.ok) {
        throw new Error('Something went wrong fetching price plans');
      }
      const data = await result.json();
      setPricePlans(data);
    };
    // Get the current subscription, if one exists
    const activeSubscription = async (): Promise<void> => {
      const result = await getCustomerActiveSubscription(
        { token },
        customerName
      );
      if (!result.ok) {
        throw new Error('Something went wrong fetching price plans');
      }
      const data = await result.json();
      if (data !== null) {
        setSelected(data.price_plan?.name);
      }
    };

    setTimeout(() => {
      if (loading === 'preload') {
        setLoading('loading');
      }
    });

    Promise.all([activeSubscription(), pricePlans()]).then(() => {
      setLoading('loaded');
    });
  }, [setLoading, setPricePlans, setSelected, token]);

  return (
    <div className='octane-component price-plan-picker'>
      {loading === 'loading' && <div className='loading'>Loading...</div>}
      {loading === 'loaded' &&
        pricePlans.map((plan) => (
          <PricePlanCard
            key={plan.name}
            pricePlan={plan}
            selected={plan.name === selected}
            onSelect={setSelected}
          />
        ))}
    </div>
  );
}
export default function PlanPicker({
  customerToken: token,
  customerName,
  ...managerProps
}: PlanPickerProps): JSX.Element {
  return (
    <TokenContext.Provider value={{ token, customerName }}>
      <PricePlanManager {...managerProps} />
    </TokenContext.Provider>
  );
}

PlanPicker.propTypes = {
  customerToken: PropTypes.string.isRequired,
};
