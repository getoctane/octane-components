import { Elements } from '@stripe/react-stripe-js';
import assert from 'assert';
import React, { useState, useEffect, useContext } from 'react';
import type { FunctionComponent } from 'react';
import { API_BASE } from '../../config';
import { StripeApiFactory } from '../../api/stripe';
import { createStripeSetupIntent } from '../../api/octane';
import { components } from '../../apiTypes';
type CustomerPortalStripeCredential =
  components['schemas']['CustomerPortalStripeCredential'];

export const StripeClientSecretContext = React.createContext<
  string | undefined
>(undefined);

/**
 * Gets a Stripe client secret for the payment intent created by the
 * StripeElements component. This hook must be called from children of the
 * StripeElements component, which is exported from this file.
 */
export const useStripeClientSecret = (): string => {
  const secret = useContext(StripeClientSecretContext);

  assert(
    secret !== undefined,
    'Expected non-null Stripe Client Secret. Double-check that you are wrapping your component tree with `StripeElements`'
  );
  return secret;
};

interface StripeElementsProps {
  customerToken: string;
}

/**
 * This component is identical to Stripe's Elements component, but accepts an
 * Octane customer token instead. We use this token to instantiate a payment
 * intent and fetch all the required credentials to make the request possible.
 *
 * Children of this component can use the `useStripeClientSecret()` hook,
 * exported in this file, to access the client secret.
 */
export const StripeElements: FunctionComponent<StripeElementsProps> = ({
  customerToken,
  children,
}) => {
  const [creds, setCreds] = useState<CustomerPortalStripeCredential | null>(
    null
  );
  useEffect(() => {
    createStripeSetupIntent({
      token: customerToken,
      urlOverride: API_BASE,
    })
      .then((result) => {
        if (!result.ok) {
          console.error(result);
          throw new Error(`An error occurred: ${result.statusText}`);
        }
        return result.json();
      })
      .then(setCreds);
  }, [customerToken]);

  if (creds === null) {
    return null;
  }
  const {
    client_secret: clientSecret,
    publishable_key: platformApiKey,
    account_id: stripeAccount,
  } = creds;

  const stripePromise = StripeApiFactory({ platformApiKey, stripeAccount });

  return (
    <StripeClientSecretContext.Provider value={clientSecret}>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        {children}
      </Elements>
    </StripeClientSecretContext.Provider>
  );
};
