import { getPaymentMethodInfo } from '../api/octane';
import { components } from '../apiTypes';

type CustomerPortalPaymentInfo =
  components['schemas']['CustomerPortalPaymentMethod'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the customer's payment method info.
 * Resolves to the payment method info, or `null` if there is none.
 */
export default function getPaymentMethod(
  customerToken: string,
  options: Options = {}
): Promise<CustomerPortalPaymentInfo | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  return getPaymentMethodInfo({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          'Something went wrong fetching the payment method info'
        );
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
}
