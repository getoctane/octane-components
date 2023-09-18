import { getDailySpend } from '../api/octane';
import { components } from '../apiTypes';

type CustomerDailySpend = components['schemas']['CustomerPortalSpendByTime'];
type CustomerDailySpendInput =
  components['schemas']['CustomerPortalSpendByTimeInput'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches customer's daily spend data, or `null` if there is none.
 */
export default async function getCustomerDailySpend(
  customerToken: string,
  payload: CustomerDailySpendInput,
  options: Options = {}
): Promise<CustomerDailySpend[] | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getDailySpend({
    token: customerToken,
    body: {
      ...payload,
    },
    urlOverride: options.baseApiUrl,
  });

  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the customer's daily spend data"
    );
  }

  const data = await response.json();
  return data;
}
