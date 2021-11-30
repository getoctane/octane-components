import { billingInfoProvided } from 'utils/sharedState';
import { updateSubscription } from 'api/octane';
import { components } from 'apiTypes';
type ActiveSubscription = components['schemas']['CustomerPortalSubscription'];

export default function subscribeCustomer(
  customerToken: string,
  pricePlanName: string
): Promise<ActiveSubscription> {
  if (!billingInfoProvided.get()) {
    return Promise.reject(
      new Error(
        'No billing information was submitted by the UI.' +
          ' Make sure the BillingInfo component was rendered and that a plan was selected.'
      )
    );
  }

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
