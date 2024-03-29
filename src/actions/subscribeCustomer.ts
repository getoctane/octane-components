import { updateSubscription } from '../api/octane';
import { components } from '../apiTypes';
import hasPaymentInfo from './hasPaymentInfo';
type ActivePricePlan = components['schemas']['CustomerPortalSubscription'];
type ActiveSubscriptionInputArgs =
  components['schemas']['CustomerPortalActiveSubscriptionInputArgs'];

export interface SubscribeCustomerOptions {
  /**
   * If true, subscribeCustomer will first query to see if there is payment
   * information on file for the customer before subscribing them.
   */
  checkForBillingInfo?: boolean;
  baseApiUrl?: string;
}

/**
 * Subscribe a customer represented by $customerToken to $pricePlanName.
 * Resolves to subscription details if successful, fails otherwise.
 */
export default function subscribeCustomer(
  customerToken: string,
  pricePlanInfo: ActiveSubscriptionInputArgs,
  options: SubscribeCustomerOptions = {}
): Promise<ActivePricePlan> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const { checkForBillingInfo = false, baseApiUrl } = options;

  const check = checkForBillingInfo
    ? hasPaymentInfo(customerToken, { baseApiUrl }).then((result) => {
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
          ...pricePlanInfo,
        },
        urlOverride: baseApiUrl,
      })
    )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Something went wrong creating a subscription.`);
      }
      return response.json();
    });
}
