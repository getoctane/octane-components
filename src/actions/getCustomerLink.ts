import { getCustomersLink } from '../api/octane';
import { components } from 'apiTypes';

type ContactLink = components['schemas']['CustomerPortalUrl'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches a link to customer's page, or `null` if there is none.
 */
export default async function getLinkToCustomerPage(
  customerToken: string,
  options: Options = {}
): Promise<ContactLink | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getCustomersLink({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error("Something went wrong fetching the customer's link");
  }
  const data = await response.json();
  return data;
}
