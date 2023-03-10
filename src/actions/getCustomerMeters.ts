import { getCustomerMeters } from '../api/octane';
import { components } from '../apiTypes';

type CustomerPortalMeters = components['schemas']['CustomerPortalMeter'][];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the customer's meters.
 * Resolves to the array of meters.
 */
export default async function getMeters(
  customerToken: string,
  options: Options = {}
): Promise<CustomerPortalMeters | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getCustomerMeters({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error("Something went wrong fetching the customer's invoices");
  }
  const data = await response.json();
  return data;
}
