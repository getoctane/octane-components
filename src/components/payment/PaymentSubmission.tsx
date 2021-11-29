import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { API_BASE } from 'config';
import { StripeApiFactory } from 'api/stripe';

import { createStripeSetupIntent } from 'api/octane';
import { components } from 'apiTypes';
import { TokenProvider } from 'hooks/useCustomerToken';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect } from 'react';
import { billingInfoProvided } from 'utils/sharedState';
type CustomerPortalStripeCredential =
  components['schemas']['CustomerPortalStripeCredential'];

interface ManagerProps {
  clientSecret?: string;
  onSubmit?: () => void;
}

function PaymentSubmissionManager({
  clientSecret,
  onSubmit,
}: ManagerProps): JSX.Element {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) {
        return;
      }
      setIsSubmitting(true);

      if (stripe == null || elements == null) {
        setIsSubmitting(false);
        return;
      }

      try {
        const cardElement = elements.getElement(CardElement);
        if (cardElement == null) {
          throw new Error('Card element unavailable.');
        }
        if (clientSecret == null) {
          throw new Error(
            'Stripe Intent is missing, could not confirm card setup'
          );
        }
        const setup = await stripe.confirmCardSetup(clientSecret, {
          payment_method: { card: cardElement },
        });
        const { error, setupIntent } = setup;

        if (error != null || setupIntent?.status !== 'succeeded') {
          throw (
            error ?? new Error('Payment method could not be saved succesfully.')
          );
        }
        billingInfoProvided.set(true);
        onSubmit && onSubmit();
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [stripe, elements, isSubmitting, clientSecret, onSubmit]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className='octane-component payment-submission'
    >
      <CardElement
        id='card-elem-row'
        options={{
          iconStyle: 'solid',
          disabled: isSubmitting,
        }}
      />

      <button className='save-button' type='submit'>
        Save
      </button>
    </form>
  );
}

export interface PaymentSubmissionProps {
  /**
   * An API token with permissions for a specific customer.
   */
  customerToken: string;
}

export function PaymentSubmission({
  customerToken,
  ...managerProps
}: PaymentSubmissionProps): JSX.Element {
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
      .then((data) => {
        setCreds(data);
      });
  }, [customerToken]);

  if (creds == null) {
    return <div className='loading'>Loading...</div>;
  }

  const {
    client_secret: clientSecret,
    publishable_key: platformApiKey,
    account_id: stripeAccount,
  } = creds;
  const stripe = StripeApiFactory({ platformApiKey, stripeAccount });

  return (
    <TokenProvider token={customerToken}>
      <Elements stripe={stripe} options={{ clientSecret }}>
        <PaymentSubmissionManager
          clientSecret={clientSecret}
          {...managerProps}
        />
      </Elements>
    </TokenProvider>
  );
}

PaymentSubmission.propTypes = {
  customerToken: PropTypes.string.isRequired,
};
