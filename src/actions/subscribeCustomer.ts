import { updateSubscription } from 'api/octane';
import { components } from 'apiTypes';
type ActiveSubscription = components['schemas']['CustomerPortalSubscription'];

export default function subscribeCustomer(
  customerToken: string,
  pricePlanName: string,
  checkForBillingInfo = false
): Promise<ActiveSubscription> {
  // TODO: if checkForBillingInfo is set to true, check the yet-to-be-implemented API endpoint first.

  return updateSubscription({
    token: customerToken,
    body: {
      price_plan_name: pricePlanName,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Something went wrong creating a subscription.`);
    }
    return response.json();
  });
}
