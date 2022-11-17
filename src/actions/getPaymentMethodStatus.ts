import { getPaymentMethodStatus } from '../api/octane';
import { components } from '../apiTypes';

type CustomerPaymentMethodStatus =
  components['schemas']['CustomerPaymentMethodStatus'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Get customer's payment method status.
 */
export default function getCustomerPaymentMethodStatus(
  customerToken: string,
  options: Options = {}
): Promise<CustomerPaymentMethodStatus | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  return getPaymentMethodStatus({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Something went wrong checking the payment status');
      }
      return response.json();
    })
    .then((status) => {
      return status ?? null;
    });
}
