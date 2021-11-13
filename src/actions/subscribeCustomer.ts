import {
  selectedPricePlan,
  existingSubscription,
  billingInfoProvided,
} from 'utils/sharedState';
import { createSubscription, updateSubscription } from 'utils/api';
import { components } from 'apiTypes';
type ActiveSubscription = components['schemas']['ActiveSubscription'];

export default function subscribeCustomer(
  customerName: string,
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

  if (existingSubscription.get() === 'no_existing_plan') {
    return createSubscription(
      {
        token: customerToken,
        body: {
          price_plan_name: plan.name,
        },
      },
      customerName
    ).then((response) => {
      if (!response.ok) {
        throw new Error(`Something went wrong creating a subscription.`);
      }
      return response.json();
    });
  } else {
    return updateSubscription(
      {
        token: customerToken,
        body: {
          price_plan_name: plan.name,
        },
      },
      customerName
    ).then((response) => {
      if (!response.ok) {
        throw new Error(`Something went wrong updating a subscription.`);
      }
      return response.json();
    });
  }
}
