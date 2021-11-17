import { loadStripe } from '@stripe/stripe-js';
import assert from 'assert';

const OCT_PLATFORM_API_KEY = process.env.OCT_PLATFORM_API_KEY;
const stripeAccountId = process.env.OCT_STRIPE_ACCOUNT_ID;
assert(
  stripeAccountId != null,
  'Expected non-null Stripe account ID. Double-check that you are setting `OCT_STRIPE_ACCOUNT_ID` in your env variables.'
);
assert(
  OCT_PLATFORM_API_KEY != null,
  'Expected non-null Stripe (public) key. Double-check that you are setting `OCT_PLATFORM_API_KEY` in your env variables.'
);

export const STRIPE_ACCOUNT_ID = stripeAccountId;

export const StripeApiPromise = loadStripe(OCT_PLATFORM_API_KEY, {
  stripeAccount: STRIPE_ACCOUNT_ID,
});

// Use a simple let binding to avoid any type of stateful storage for this sensitive secret that
// should be forwarded directly to the Stripe Elements components.
let clientSecret: string;

export const getSetupIntentClientSecret = (): string => clientSecret;

export const setSetupIntentClientSecret = (s: string): void => {
  clientSecret = s;
};
