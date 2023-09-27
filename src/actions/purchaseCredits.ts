import { purchaseCredits } from '../api/octane';
import { components } from '../apiTypes';

type CreditGrantType = components['schemas']['CreditGrant'];
type CreditsToPurchaseInput =
  components['schemas']['CustomerPortalCreditPurchase'];
type Options = {
  baseApiUrl?: string;
};

/**
 * Allows customers to purchase credits.
 * Resolves to credit grant info details if successful, fails otherwise.
 */
export default function purchaseCustomerCredits(
  customerToken: string,
  payload: CreditsToPurchaseInput,
  options: Options = {}
): Promise<CreditGrantType> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  return purchaseCredits({
    token: customerToken,
    body: {
      ...payload,
    },
    urlOverride: options?.baseApiUrl,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Something went wrong purchasing credits.`);
    }
    return response.json();
  });
}
