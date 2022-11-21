import { getContactInfo } from '../api/octane';
import { components } from '../apiTypes';

type ContactInfo = components['schemas']['ContactInfo'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the customer's contact info, or `null` if there is none.
 */
export default async function getCustomerContactInfo(
  customerToken: string,
  options: Options = {}
): Promise<ContactInfo | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getContactInfo({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the customer's contact info"
    );
  }
  const data = await response.json();
  return data;
}
