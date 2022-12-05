import { getCustomerInvoices } from '../api/octane';
import { components } from '../apiTypes';

type Invoices = components['schemas']['CustomerPortalInvoice'][];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the customer's invoices.
 * Resolves to the array of invoices, or `null` if there is none.
 */
export default async function getInvoices(
  customerToken: string,
  options: Options = {}
): Promise<Invoices | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getCustomerInvoices({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error("Something went wrong fetching the customer's invoices");
  }
  const data = await response.json();
  return data;
}
