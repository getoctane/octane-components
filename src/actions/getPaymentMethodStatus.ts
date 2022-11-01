import { getPaymentMethodStatus } from '../api/octane';
import { components } from '../apiTypes';

type CustomerPaymentMethodStatus =
  components['schemas']['CustomerPaymentMethodStatus'];

/**
 * Get customer's payment method status.
 */
export default function getCustomerPaymentMethodStatus(
  customerToken: string
): Promise<CustomerPaymentMethodStatus | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  return getPaymentMethodStatus({ token: customerToken })
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
