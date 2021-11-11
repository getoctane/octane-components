import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { components } from 'apiTypes';
import { PricePlanCard } from 'components/PricePlanCard';
import { fetchPricePlans } from 'utils/api';

export type PricePlan = components['schemas']['PricePlan'];
export type MeteredComponent = components['schemas']['MeteredComponent'];
export interface PlanPickerProps {
  /**
   * An API token with permissions for a specific customer
   */
  customerToken: string;
  /**
   * The name of the currently selected plan, if any.
   * This is the initial value that the PlanPicker's internal
   * state uses to preselect a plan.
   */
  initialSelected?: string;
}

const TokenContext = React.createContext<string>('NO_TOKEN');

function PricePlanManager(): JSX.Element {
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  const token = useContext(TokenContext);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const result = await fetchPricePlans(token);
      if (!result.ok) {
        throw new Error('Something went wrong fetching price plans');
      }
      const data = await result.json();
      setPricePlans(data);
    };
    fetchData();
  }, [setPricePlans, token]);

  const [selected, setSelected] = useState<string | undefined>(undefined);

  return (
    <div className='octane-component price-plan-picker'>
      {pricePlans.map((plan) => (
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
  customerToken,
}: PlanPickerProps): JSX.Element {
  return (
    <TokenContext.Provider value={customerToken}>
      <PricePlanManager />
    </TokenContext.Provider>
  );
}

PlanPicker.propTypes = {
  customerToken: PropTypes.string.isRequired,
};
