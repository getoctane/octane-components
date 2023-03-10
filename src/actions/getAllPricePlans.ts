import { getPricePlans } from '../api/octane';
import { components } from '../apiTypes';

type PricePlan = components['schemas']['PricePlan'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Get all price plans associated with a vendor.
 */
export default function getAllPricePlans(
  customerToken: string,
  options: Options = {}
): Promise<PricePlan[] | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  return getPricePlans({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Something went wrong with getting price plans');
      }
      return response.json();
    })
    .then((pricePlans) => {
      return pricePlans;
    });
}
