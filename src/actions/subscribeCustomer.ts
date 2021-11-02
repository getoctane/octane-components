import {
  updateSubscription,
  getPaymentMethodStatus,
  VALID_PAYMENT_METHOD,
} from 'api/octane';
import { components } from 'apiTypes';
type ActiveSubscription = components['schemas']['CustomerPortalSubscription'];

export default function subscribeCustomer(
  customerToken: string,
  pricePlanName: string,
  checkForBillingInfo = false
): Promise<ActiveSubscription> {
  // TODO: if checkForBillingInfo is set to true, check the yet-to-be-implemented API endpoint first.

  const check = checkForBillingInfo
    ? getPaymentMethodStatus({ token: customerToken })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Something went wrong checking the payment status');
          }
          return response.json();
        })
        .then((data) => {
          if (data.status !== VALID_PAYMENT_METHOD) {
            throw new Error(
              'Payment status is missing, cannot subscribe customer'
            );
          }
        })
    : Promise.resolve();

  return check
    .then(() =>
      updateSubscription({
        token: customerToken,
        body: {
          price_plan_name: pricePlanName,
        },
      })
    )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Something went wrong creating a subscription.`);
      }
      return response.json();
    });
}
