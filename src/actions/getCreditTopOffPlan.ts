import { getCreditTopOffPlan } from '../api/octane';
import { components } from '../apiTypes';

type CreditTopOffPlan = components['schemas']['CreditTopOffPlan'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the customer credit top-off plan, or `null` if there is none.
 */
export default async function getCustomerCreditTopOffPlan(
  customerToken: string,
  options: Options = {}
): Promise<CreditTopOffPlan | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getCreditTopOffPlan({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the customer's credit top-off plan info"
    );
  }
  const data = await response.json();
  return data;
}
