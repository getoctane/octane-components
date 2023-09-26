import { getCreditGrants } from '../api/octane';
import { components } from '../apiTypes';

type CrediGrants = components['schemas']['CustomerPortalCreditGrant'][];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the customer credit grants, or `null` if there is none.
 */
export default async function getCustomerCreditGrants(
  customerToken: string,
  options: Options = {}
): Promise<CrediGrants | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getCreditGrants({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the customer's credit grants info"
    );
  }
  const data = await response.json();
  return data;
}
