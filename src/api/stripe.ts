import { loadStripe } from '@stripe/stripe-js';
import assert from 'assert';

const stripeKey = process.env.OCT_STRIPE_PUBLIC_KEY;
assert(
  stripeKey != null,
  'Expected non-null Stripe (secret) key. Double-check that you are setting `OCT_STRIPE_PUBLIC_KEY` in your env variables.'
);

export const STRIPE_PUBLIC_KEY = stripeKey;

export const StripeApiPromise = loadStripe(STRIPE_PUBLIC_KEY);

// Use a simple let binding to avoid any type of stateful storage for this sensitive secret that
// should be forwarded directly to the Stripe Elements components.
let clientSecret: string;

export const getSetupIntentClientSecret = (): string => clientSecret;
export const setSetupIntentClientSecret = (s: string): void => {
  clientSecret = s;
};
