import { getSpendByTime } from '../api/octane';
import { components } from '../apiTypes';

type CustomerSpendByTime = components['schemas']['CustomerPortalSpendByTime'];
type CustomerSpendByTimeInput =
  components['schemas']['CustomerPortalSpendByTimeInput'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches customer's spend by time data, or `null` if there is none.
 */
export default async function getCustomerSpendByTime(
  customerToken: string,
  payload: CustomerSpendByTimeInput,
  options: Options = {}
): Promise<CustomerSpendByTime[] | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getSpendByTime({
    token: customerToken,
    body: {
      ...payload,
    },
    urlOverride: options.baseApiUrl,
  });

  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the customer's spend by time data"
    );
  }

  const data = await response.json();
  return data;
}
