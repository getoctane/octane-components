import { getUsageByTime } from '../api/octane';
import { components } from '../apiTypes';

type CustomerUsageByTime = components['schemas']['CustomerPortalUsageByTime'];
type CustomerUsageByTimeInput =
  components['schemas']['CustomerPortalUsageByTimeInput'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches customer's daily usage data, or `null` if there is none.
 */
export default async function getUsage(
  customerToken: string,
  payload: CustomerUsageByTimeInput,
  options: Options = {}
): Promise<CustomerUsageByTime | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getUsageByTime({
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
