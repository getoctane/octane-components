import { getCreditLedger } from '../api/octane';
import { components } from '../apiTypes';

type CreditLedger = components['schemas']['CreditLedger'][];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the customer entire credit ledger, or `null` if there is none.
 */
export default async function getCustomerCreditLedger(
  customerToken: string,
  options: Options = {}
): Promise<CreditLedger | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getCreditLedger({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the customer's credit ledger info"
    );
  }
  const data = await response.json();
  return data;
}
