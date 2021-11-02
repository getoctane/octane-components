import { loadStripe, Stripe } from '@stripe/stripe-js';
import assert from 'assert';

export interface StripeApiConfig {
  platformApiKey: string;
  stripeAccount: string;
}

export const StripeApiFactory = ({
  platformApiKey = process.env.OCT_PLATFORM_API_KEY,
  stripeAccount = process.env.OCT_STRIPE_ACCOUNT_ID,
}: Partial<StripeApiConfig>): Promise<Stripe | null> => {
  assert(
    stripeAccount != null,
    'Expected non-null Stripe account ID. Double-check that you are setting `OCT_STRIPE_ACCOUNT_ID` in your env variables.'
  );
  assert(
    platformApiKey != null,
    'Expected non-null Stripe (public) key. Double-check that you are setting `OCT_PLATFORM_API_KEY` in your env variables.'
  );
  return loadStripe(platformApiKey, {
    stripeAccount: stripeAccount,
  });
};
