import React from 'react';
import { formatCurrency } from 'utils/format';
import PropTypes from 'prop-types';

import { components } from 'apiTypes';
type PricePlan = components['schemas']['PricePlan'];
export interface PricePlanCardProps {
  pricePlan: PricePlan;
}

export function PricePlanCard({ pricePlan }: PricePlanCardProps): JSX.Element {
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

PricePlanCard.propTypes = {
  pricePlan: PropTypes.object.isRequired,
};
