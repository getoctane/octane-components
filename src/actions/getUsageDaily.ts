import { getDailyUsage } from '../api/octane';
import { components } from '../apiTypes';

type CustomerDailyUsage = components['schemas']['CustomerPortalDailyUsage'];
type CustomerDailyUsageInput =
  components['schemas']['CustomerPortalDailyUsageInput'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches customer's daily usage data, or `null` if there is none.
 */
export default async function getUsage(
  customerToken: string,
  payload: CustomerDailyUsageInput,
  options: Options = {}
): Promise<CustomerDailyUsage | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getDailyUsage({
    token: customerToken,
    body: {
      ...payload,
    },
    urlOverride: options.baseApiUrl,
  });

  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the customer's daily usage data"
    );
  }

  const data = await response.json();
  return data;
}
