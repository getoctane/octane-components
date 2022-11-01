import { getPaymentMethodStatus, VALID_PAYMENT_METHOD } from '../api/octane';

/**
 * Checks if the customer represented by $customerToken has valid payment info.
 * Resolves to `true` if so, `false` if not.
 */
export default function hasPaymentInfo(
  customerToken: string
): Promise<boolean> {
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
    .then(({ status }) => {
      return status === VALID_PAYMENT_METHOD;
    });
}
