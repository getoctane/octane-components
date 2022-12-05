import { getCustomerUsage } from '../api/octane';
import { components } from '../apiTypes';

type CustomerUsage = components['schemas']['CustomerPortalUsage'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches customer's usage data, or `null` if there is none.
 */
export default async function getUsage(
  customerToken: string,
  options: Options = {}
): Promise<CustomerUsage | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getCustomerUsage({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error("Something went wrong fetching the customer's usage data");
  }
  const data = await response.json();
  return data;
}
