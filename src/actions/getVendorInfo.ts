import { getVendorInfo } from '../api/octane';
import { components } from '../apiTypes';

type VendorInfo = components['schemas']['VendorInfo'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the vendor's info related to the customer, or `null` if there is none.
 */
export default async function getCustomersVendorInfo(
  customerToken: string,
  options: Options = {}
): Promise<VendorInfo | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getVendorInfo({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error("Something went wrong fetching the customer's vendor info");
  }
  const data = await response.json();
  return data;
}
