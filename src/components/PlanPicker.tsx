import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { components } from 'apiTypes';
import { PricePlanCard } from 'components/PricePlanCard';
import { fetchPricePlans } from 'utils/api';

export type PricePlan = components['schemas']['PricePlan'];
export type MeteredComponent = components['schemas']['MeteredComponent'];
export interface PricePlansProps {
  customerToken: string;
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

  return (
    <div className='octane-component price-plan-picker'>
      {pricePlans.map((plan) => (
        <PricePlanCard key={plan.name} pricePlan={plan} />
      ))}
    </div>
  );
}
export default function PricePlans({
  customerToken,
}: PricePlansProps): JSX.Element {
  return (
    <TokenContext.Provider value={customerToken}>
      <PricePlanManager />
    </TokenContext.Provider>
  );
}

PricePlans.propTypes = {
  customerToken: PropTypes.string.isRequired,
};
