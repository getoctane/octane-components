import React from 'react';
import pluralize from 'pluralize';
import { formatCurrency } from 'utils/format';
import { components } from 'apiTypes';
import PropTypes from 'prop-types';

type MeteredComponent = components['schemas']['MeteredComponent'];
type PriceScheme = components['schemas']['PriceScheme'];

/**
 * Represents one row of a price tier for a metered component.
 * For example:
 *
 *    First 360           $0.03/second
 *    Then                $0.01/second
 *    ^^^^^^^^^           ^^^^^ ^^^^^
 *     label                |    unit
 *                          \---------price
 * Note that:
 *   - unit isn't needed for stairstep
 *   - label isn't needed for flat pricing or for pricing
 *        schemes with only one tier
 */

interface PriceTier {
  // Used for volume / stairstep / tiered, i.e. "for first X ..."
  label?: string;
  // The price paid
  price: string;
  // Optionally a unit (omitted for stairstep)
  unit?: string;
}

/**
 * Given a price scheme, creates a label for each tier in the scheme.
 */
export function getPriceTiers({
  prices,
  scheme_type: schemeType,
  unit_name: unitName,
}: PriceScheme): PriceTier[] {
  if (!prices) {
    return [];
  }
  const unit = unitName ?? 'unit';

  if (schemeType === 'PriceSchemeType.FLAT' || prices.length === 1) {
    return [
      {
        price: formatCurrency(prices[0]?.price ?? 0),
        unit,
      },
    ];
  }

  if (
    schemeType === 'PriceSchemeType.VOLUME' ||
    schemeType === 'PriceSchemeType.STAIRSTEP'
  ) {
    return prices.map((tier, index) => {
      let label: string;
      // First Element
      if (index === 0) {
        label = `Up to ${tier.cap}`;
      }
      // Last Element
      else if (index === prices.length - 1) {
        label = `Then`;
      } else {
        // Everything in-between
        label = `${prices[index - 1]?.cap}-${tier.cap}`;
      }

      const result: PriceTier = {
        price: formatCurrency(tier.price),
        label,
      };
      // Stairstep is a flat rate per tier, so it doesn't
      // need a unit. Volume, on the other hand, still does.
      if (schemeType === 'PriceSchemeType.VOLUME') {
        result.unit = unit;
      }
      return result;
    });
  }

  // TIERED
  return prices.map((tier, index) => {
    let label: string;
    // First Element
    if (index === 0) {
      label = `First ${tier.cap}`;
    }
    // Last Element
    else if (index === prices.length - 1) {
      label = `Then`;
    } else {
      // Everything in-between
      label = `Next ${(tier.cap ?? 0) - (prices[index - 1]?.cap ?? 0)}`;
    }
    return {
      price: formatCurrency(tier.price),
      label,
      unit,
    };
  });
}

export interface MeteredComponentProps {
  meteredComponent: MeteredComponent;
}

export function MeteredComponent({
  meteredComponent,
}: MeteredComponentProps): JSX.Element | null {
  // TODO: meterName should be a string, but is currently unknown.
  const {
    meter_name: meterName,
    price_scheme: priceScheme,
    limit,
  } = meteredComponent;
  if (typeof meterName !== 'string' || !priceScheme) {
    return null;
  }

  const unit = priceScheme.unit_name ?? 'unit';

  const meterTiers = getPriceTiers(priceScheme);

  return (
    <div className='metered-component'>
      <div className='label meter-name'>{meterName}</div>
      <div className='meter-tiers'>
        {meterTiers.map(({ price, label, unit }, idx) => (
          <div className='meter-tier' key={idx}>
            {label && <span className='tier-label'>{label + ' '}</span>}
            <span className='tier-price'>
              <span className='price'>{price}</span>
              {!!unit && (
                <>
                  /<span className='unit'>{unit}</span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>
      {!!limit && (
        <div className='meter-limit'>
          Limit: {limit} {pluralize(unit, limit)}
        </div>
      )}
    </div>
  );
}

MeteredComponent.propTypes = {
  meteredComponent: PropTypes.object.isRequired,
};
