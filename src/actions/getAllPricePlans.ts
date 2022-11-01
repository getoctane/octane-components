import { getPricePlans } from '../api/octane';
import { components } from '../apiTypes';

type PricePlan = components['schemas']['PricePlan'];

/**
 * Get all price plans associated with a vendor.
 */
export default function getAllPricePlans(
  customerToken: string
): Promise<PricePlan[]> {
  return getPricePlans({ token: customerToken })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Something went wrong with getting price plans');
      }
      return response.json();
    })
    .then((pricePlans) => {
      return pricePlans ?? [];
    });
}
