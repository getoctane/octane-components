import React, { useState } from 'react';
import { formatCurrency } from 'utils/format';
import PropTypes from 'prop-types';
import { components } from 'apiTypes';
import { MeteredComponent } from 'components/MeteredComponent';

type PricePlan = components['schemas']['PricePlan'];
type MeteredComponent = components['schemas']['MeteredComponent'];

export interface PricePlanCardProps {
  /**
   * The price plan to render
   */
  pricePlan: PricePlan;
  onSelect?: (planName: string) => void;
  selected?: boolean;
}

export function PricePlanCard({
  pricePlan,
  selected = false,
  onSelect = (): void => {
    /* noop */
  },
}: PricePlanCardProps): JSX.Element {
  const {
    name,
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
    <div className={'price-plan-card' + (selected ? ' selected' : '')}>
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
      <button
        className='select-plan'
        disabled={selected}
        onClick={(): void => onSelect(name)}
      >
        {selected ? 'Selected' : 'Select'}
      </button>
    </div>
  );
}

PricePlanCard.propTypes = {
  pricePlan: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
};
