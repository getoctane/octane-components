import { getCustomerUsage } from '../api/octane';
import { components } from '../apiTypes';

type CustomerPortalUsage = components['schemas']['CustomerPortalUsage'];
type CustomerPortalMeterLabelFilter =
  components['schemas']['CustomerPortalMeterLabelFilter'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches customer's usage data, or `null` if there is none.
 */
export default async function getUsage(
  customerToken: string,
  payload: CustomerPortalMeterLabelFilter,
  options: Options = {}
): Promise<CustomerPortalUsage | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getCustomerUsage({
    token: customerToken,
    body: {
      ...payload,
    },
    urlOverride: options.baseApiUrl,
  });

  if (!response.ok) {
    throw new Error("Something went wrong fetching the customer's usage data");
  }

  const data = await response.json();
  return data;
}
