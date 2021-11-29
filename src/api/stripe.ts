import { loadStripe, Stripe } from '@stripe/stripe-js';
import { createStripeSetupIntent } from 'api/octane';
import assert from 'assert';

export interface StripeApiConfig {
  platformApiKey: string;
  stripeAccountId: string;
}

export const StripeApiFactory = ({
  platformApiKey = process.env.OCT_PLATFORM_API_KEY,
  stripeAccountId = process.env.OCT_STRIPE_ACCOUNT_ID,
}: Partial<StripeApiConfig>): Promise<Stripe | null> => {
  assert(
    stripeAccountId != null,
    'Expected non-null Stripe account ID. Double-check that you are setting `OCT_STRIPE_ACCOUNT_ID` in your env variables.'
  );
  assert(
    platformApiKey != null,
    'Expected non-null Stripe (public) key. Double-check that you are setting `OCT_PLATFORM_API_KEY` in your env variables.'
  );
  return loadStripe(platformApiKey, {
    stripeAccount: stripeAccountId,
  });
};

// Use a simple let binding to avoid any type of stateful storage for this sensitive secret that
// should be forwarded directly to the Stripe Elements components.
let clientSecret: string;

export const getSetupIntentClientSecret = (): string => clientSecret;

export const setSetupIntentClientSecret = (s: string): void => {
  clientSecret = s;
};
