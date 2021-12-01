import { updateSubscription } from '../api/octane';
import { components } from '../apiTypes';
import { hasPaymentInfo } from './hasPaymentInfo';
type ActiveSubscription = components['schemas']['CustomerPortalSubscription'];

export interface SubscribeCustomerOptions {
  /**
   * If true, subscribeCustomer will first query to see if there is payment
   * information on file for the customer before subscribing them.
   */
  checkForBillingInfo?: boolean;
}

/**
 * Subscribe a customer represented by $customerToken to $pricePlanName.
 * Resolves to subscription details if successful, fails otherwise.
 */
export default function subscribeCustomer(
  customerToken: string,
  pricePlanName: string,
  options: SubscribeCustomerOptions = {}
): Promise<ActiveSubscription> {
  const { checkForBillingInfo = false } = options;

  const check = checkForBillingInfo
    ? hasPaymentInfo(customerToken).then((result) => {
        if (!result) {
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
