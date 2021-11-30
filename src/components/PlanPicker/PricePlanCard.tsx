import React from 'react';
import { formatCurrency } from 'utils/format';
import PropTypes from 'prop-types';
import { components } from 'apiTypes';
import { MeteredComponent } from 'components/PlanPicker/MeteredComponent';

type PricePlan = components['schemas']['PricePlan'];
type MeteredComponent = components['schemas']['MeteredComponent'];

export interface PricePlanCardProps {
  /**
   * The price plan to render
   */
  pricePlan: PricePlan;
  /**
   * Fired when the plan's "Select" button is clicked
   */
  onSelect?: (planName: string, plan: PricePlan) => void;
  /**
   * Whether or not to display this card as selected
   */
  selected?: boolean;
  /**
   * Whether or not to indicate that this plan is the existing plan subscribed
   * to by the customer.
   */
  existing?: boolean;
}

export function PricePlanCard({
  pricePlan,
  selected = false,
  existing = false,
  onSelect = () => {
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

  const buttonText = (() => {
    if (existing) {
      return 'Current subscription';
    } else if (selected) {
      return 'Selected';
    } else {
      return 'Select';
    }
  })();

  return (
    <div
      className={
        'price-plan-card' +
        (selected ? ' selected' : '') +
        (existing ? ' existing' : '')
      }
    >
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
        disabled={selected || existing}
        onClick={() => onSelect(name, pricePlan)}
      >
        {buttonText}
      </button>
    </div>
  );
}

PricePlanCard.propTypes = {
  pricePlan: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
};
