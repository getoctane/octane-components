import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from 'utils/format';
import { components } from 'apiTypes';

export type PricePlan = components['schemas']['PricePlan'];
export type MeteredComponent = components['schemas']['MeteredComponent'];
export interface PricePlansProps {
  customerToken: string;
}

export interface PricePlanCardProps {
  pricePlan: PricePlan;
}

const TokenContext = React.createContext<string>('NO_TOKEN');

function PricePlanCard({ pricePlan }: PricePlanCardProps): JSX.Element {
  const {
    display_name: displayName,
    base_price: basePrice,
    period,
  } = pricePlan;

  const billingSchedule =
    period === 'month' ? 'Billed monthly' : `Billed every ${period}`;
  const hasBasePrice = basePrice != null;
  const formattedBasePrice = hasBasePrice ? formatCurrency(basePrice) : null;
  const periodAbbrev = period === 'month' ? 'mo' : period;

  return (
    <div className='price-plan-card'>
      <div className='plan-name'>{displayName} </div>
      {hasBasePrice && (
        <div className='base-price'>
          <span className='label starting-at'>Starting at </span>
          <span className='cost'>{formattedBasePrice}</span>
          <span className='period'>/{periodAbbrev}</span>
        </div>
      )}
      <div className='separator' />
      <div className='label billing-sched'>{billingSchedule}</div>
    </div>
  );
}

function PricePlanManager(): JSX.Element {
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  const token = useContext(TokenContext);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const result = await fetch('https://api.cloud.getoctane.io/price_plans/');
      // TODO: pass the token to `fetch` as an auth header
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
  customerToken: PropTypes.string,
};
