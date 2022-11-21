import { getCustomerActiveSubscription } from '../api/octane';
import { components } from '../apiTypes';

type ActiveSubscription =
  components['schemas']['CustomerPortalActiveSubscription'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the customer's active subscription.
 * Resolves to the price plan for that subscription, or `null` if there is none.
 */
export default function getActiveSubscription(
  customerToken: string,
  options: Options = {}
): Promise<ActiveSubscription | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  return getCustomerActiveSubscription({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          'Something went wrong fetching the active subscription data'
        );
      }
      return response.json();
    })
    .then((data) => {
      return data;
    });
}
