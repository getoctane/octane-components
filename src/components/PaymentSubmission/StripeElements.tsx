import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions } from '@stripe/stripe-js';
import React, { useState, useEffect, useContext } from 'react';
import type { FunctionComponent } from 'react';
import { StripeApiFactory } from '../../api/stripe';
import { createStripeSetupIntent } from '../../api/octane';
import { components } from '../../apiTypes';
import { useCustomerToken } from '../../hooks/useCustomerToken';
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
export const useStripeClientSecret = (): string | undefined => {
  const secret = useContext(StripeClientSecretContext);
  return secret;
};

interface StripeElementsProps {
  /**
   * An element to render while the Stripe Elements context is set up. Normally,
   * Stripe's <Elements> component can render immediately and waits for a Stripe
   * promise to resolve, but it seems to require a client secret string
   * synchronously. This means that while we're fetching that string, we have
   * some loading time when we can't render the Element component.
   *  @see: https://stripe.com/docs/js/elements_object/create#stripe_elements-options-clientSecret
   */
  loading?: React.ReactElement;
  onError?: (err: unknown) => void;
  baseApiUrl?: string;
  children: React.ReactNode;
  /**
   * Use options object to customize the Stripe Elements component.
   */
  options?: Omit<StripeElementsOptions, 'clientSecret'>;
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
  loading = null,
  onError,
  children,
  baseApiUrl,
  options = {},
}) => {
  const { token } = useCustomerToken();
  const [creds, setCreds] = useState<CustomerPortalStripeCredential | null>(
    null
  );

  useEffect(() => {
    const req = createStripeSetupIntent({
      token,
      urlOverride: baseApiUrl,
    })
      .then((result) => {
        if (!result.ok) {
          console.error(result);
          throw new Error(`An error occurred: ${result.statusText}`);
        }
        return result.json();
      })
      .then(setCreds);
    if (onError) {
      req.catch(onError);
    }
  }, [token, onError, baseApiUrl]);

  // Render the loading element if one is provided.
  if (creds === null) {
    return loading;
  }

  const {
    client_secret: clientSecret,
    publishable_key: platformApiKey,
    account_id: stripeAccount,
  } = creds;

  const stripePromise = StripeApiFactory({ platformApiKey, stripeAccount });

  return (
    <StripeClientSecretContext.Provider value={clientSecret}>
      <Elements stripe={stripePromise} options={{ clientSecret, ...options }}>
        {children}
      </Elements>
    </StripeClientSecretContext.Provider>
  );
};
