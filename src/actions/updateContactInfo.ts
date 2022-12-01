import { updateContactInfo } from '../api/octane';
import { components } from '../apiTypes';

type ContactInfoReturnType = components['schemas']['ContactInfo'];
type ContactInfoInput = components['schemas']['ContactInfoInputArgs'];
type Options = {
  baseApiUrl?: string;
};

/**
 * Updates customer's contact info.
 * Resolves to contact info details if successful, fails otherwise.
 */
export default function updateCustomerContactInfo(
  customerToken: string,
  contactInfo: ContactInfoInput,
  options: Options = {}
): Promise<ContactInfoReturnType> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  return updateContactInfo({
    token: customerToken,
    body: {
      ...contactInfo,
    },
    urlOverride: options?.baseApiUrl,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Something went wrong updating a contact info.`);
    }
    return response.json();
  });
}
