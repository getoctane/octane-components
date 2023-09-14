import { getTotalAccruedRevenue } from '../api/octane';
import { components } from '../apiTypes';

type CustomerTotalAccruedRevenue =
  components['schemas']['CustomerPortalAccruedRevenue'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches customer's accrued revenue data, or `null` if there is none.
 */
export default async function getCustomerTotalAccruedRevenue(
  customerToken: string,
  options: Options = {}
): Promise<CustomerTotalAccruedRevenue | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getTotalAccruedRevenue({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });

  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the customer's accrued revenue data"
    );
  }

  const data = await response.json();
  return data;
}
