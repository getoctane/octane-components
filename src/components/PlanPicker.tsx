import { components } from 'apiTypes';
import { PricePlanCard } from 'components/PricePlanCard';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { getCustomerActiveSubscription, getPricePlans } from 'api/octane';
import { existingSubscription, selectedPricePlan } from 'utils/sharedState';

export type PricePlan = components['schemas']['PricePlan'];
export type MeteredComponent = components['schemas']['MeteredComponent'];

type LoadingState =
  // Loading has started, but it's too soon to show a loading state
  | 'preload'
  // It's taken some time, show a loading state
  | 'loading'
  // The component has all the data it needs
  | 'loaded';

// How long before we should think about showing a loading spinner?
const PRELOAD_TIME = 300;

interface PricePlanManagerProps {
  /**
   * Only show price plans that have these tags
   */
  pricePlanTags?: string[];
  /**
   * Only show price plans with these names
   */
  pricePlanNames?: string[];
  /**
   * Callback triggered whenever a plan is selected.
   */
  onPlanSelect?: (planName: string, plan: PricePlan) => void;
}

export interface PlanPickerProps extends PricePlanManagerProps {
  /**
   * An API token with permissions for a specific customer.
   */
  customerToken: string;
}

const TokenContext = React.createContext<{
  token: string;
}>({
  token: 'NO_TOKEN',
});

const NOOP = (): void => {
  /* no-op */
};

function PricePlanManager({
  pricePlanTags,
  pricePlanNames,
  onPlanSelect = NOOP,
}: PricePlanManagerProps): JSX.Element {
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<LoadingState>('preload');

  const { token } = useContext(TokenContext);

  const onSelectPlanName = useCallback(
    (planName: string, plan: PricePlan) => {
      // Update the local state
      setSelected(planName);
      // As well as the global state
      selectedPricePlan.set(plan);
      // As well as the user-provided callback
      onPlanSelect(planName, plan);
    },
    [onPlanSelect]
  );

  useEffect(() => {
    // Clear any existing state (for example, if we're in storybook and
    // the customer token changes)
    setPricePlans([]);
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
      const result = await getCustomerActiveSubscription({ token });
      if (!result.ok) {
        throw new Error('Something went wrong fetching price plans');
      }
      const data = await result.json();
      // Update component state
      if (data !== null && data.price_plan) {
        onSelectPlanName(data.price_plan.name, data.price_plan);
      }
      // Update shared global state
      // If there's state already, it means a plan was picked but the customer
      // wasn't subscribed all the way. If they have no active subscription,
      // re-select whatever they last picked.
      const previousExistingSubscription =
        existingSubscription.get() ?? 'no_existing_plan';

      if (data != null) {
        existingSubscription.set(data);
      } else {
        existingSubscription.set(previousExistingSubscription);
      }
    };

    setTimeout(() => {
      if (loading === 'preload') {
        setLoading('loading');
      }
    }, PRELOAD_TIME);

    Promise.all([activeSubscription(), pricePlans()]).then(() => {
      setLoading('loaded');
    });
  }, [
    loading,
    onSelectPlanName,
    pricePlanNames,
    pricePlanTags,
    setLoading,
    setPricePlans,
    setSelected,
    token,
  ]);

  return (
    <div className='octane-component price-plan-picker'>
      {loading === 'loading' && <div className='loading'>Loading...</div>}
      {loading === 'loaded' &&
        pricePlans.map((plan) => (
          <PricePlanCard
            key={plan.name}
            pricePlan={plan}
            selected={plan.name === selected}
            onSelect={onSelectPlanName}
          />
        ))}
    </div>
  );
}
export default function PlanPicker({
  customerToken: token,
  ...managerProps
}: PlanPickerProps): JSX.Element {
  return (
    <TokenContext.Provider value={{ token }}>
      <PricePlanManager {...managerProps} />
    </TokenContext.Provider>
  );
}

PlanPicker.propTypes = {
  customerToken: PropTypes.string.isRequired,
};
