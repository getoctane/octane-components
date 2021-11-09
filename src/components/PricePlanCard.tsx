import React from 'react';
import { formatCurrency } from 'utils/format';
import PropTypes from 'prop-types';
import { components } from 'apiTypes';
import { MeteredComponent } from 'components/MeteredComponent';

type PricePlan = components['schemas']['PricePlan'];
type MeteredComponent = components['schemas']['MeteredComponent'];

export interface PricePlanCardProps {
  pricePlan: PricePlan;
}

export function PricePlanCard({ pricePlan }: PricePlanCardProps): JSX.Element {
  const {
    display_name: displayName,
    base_price: basePrice,
    period,
    metered_components: meteredComponents,
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
          <span className='value'>{formattedBasePrice}</span>
          <span className='period'>/{periodAbbrev}</span>
        </div>
      )}
      <div className='separator' />

      <div className='metered-components'>
        {meteredComponents?.map((component, idx) => (
          /* Note: we have to key by idx here because we don't have access to
            anything 100% unique to the metered component exposed. */
          <MeteredComponent key={idx} meteredComponent={component} />
        ))}
      </div>
      <div className='label billing-sched'>{billingSchedule}</div>
    </div>
  );
}

PricePlanCard.propTypes = {
  pricePlan: PropTypes.object.isRequired,
};
