import { getAvailableCreditBalance } from '../api/octane';
import { components } from '../apiTypes';

type AvailableCreditBalance =
  components['schemas']['CustomerPortalAvailableCreditBalance'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the customer available credit balance, or `null` if there is none.
 */
export default async function getCustomerAvailableCreditBalance(
  customerToken: string,
  options: Options = {}
): Promise<AvailableCreditBalance | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getAvailableCreditBalance({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the customer's available credit balance data"
    );
  }
  const data = await response.json();
  return data;
}
