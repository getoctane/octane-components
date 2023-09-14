import { getDailyAccruedRevenue } from '../api/octane';
import { components } from '../apiTypes';

type CustomerDailyAccruedRevenue =
  components['schemas']['CustomerPortalDailyAccruedRevenue'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches customer's daily accrued revenue data, or `null` if there is none.
 */
export default async function getCustomerDailyAccruedRevenue(
  customerToken: string,
  options: Options = {}
): Promise<CustomerDailyAccruedRevenue[] | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getDailyAccruedRevenue({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });

  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the customer's daily accrued revenue data"
    );
  }

  const data = await response.json();
  return data;
}
