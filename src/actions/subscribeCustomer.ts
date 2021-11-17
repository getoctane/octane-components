import {
  selectedPricePlan,
  existingSubscription,
  billingInfoProvided,
} from 'utils/sharedState';
import { updateSubscription } from 'utils/api';
import { components } from 'apiTypes';
type ActiveSubscription = components['schemas']['CustomerPortalSubscription'];

export default function subscribeCustomer(
  customerToken: string
): Promise<ActiveSubscription> {
  const plan = selectedPricePlan.get();
  if (plan === null) {
    return Promise.reject(
      new Error(
        'No price plan was selected by the UI.' +
          ' Make sure the PlanPicker component was rendered and that a plan was selected.'
      )
    );
  }

  if (!billingInfoProvided.get()) {
    return Promise.reject(
      new Error(
        'No billing information was submitted by the UI.' +
          ' Make sure the BillingInfo component was rendered and that a plan was selected.'
      )
    );
  }

  if (existingSubscription.get() === null) {
    return Promise.reject(
      new Error(
        "The customer's existing subscription was not checked." +
          ' Make sure the PlanPicker component was rendered and that a plan was selected.'
      )
    );
  }

  return updateSubscription({
    token: customerToken,
    body: {
      price_plan_name: plan.name,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Something went wrong creating a subscription.`);
    }
    return response.json();
  });
}
