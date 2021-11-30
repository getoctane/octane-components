import {
  CardElement,
  Elements,
  useElements,
  useStripe,
  CardElementProps,
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

interface ManagerProps extends CardElementProps {
  clientSecret?: string;
  /**
   * A callback that fires whenever billing info has successfully submitted.
   */
  onSubmit?: () => void;
  /**
   * Text to show on the "save payment" button. Defaults to "Save".
   */
  saveButtonText?: string;
}

function PaymentSubmissionManager({
  clientSecret,
  onSubmit,
  saveButtonText = 'SAVE',
  options,
  ...cardProps
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

  const cardOptions = { disabled: isSubmitting, ...options };

  return (
    <form
      onSubmit={handleSubmit}
      className='octane-component payment-submission'
    >
      <CardElement id='card-elem-row' options={cardOptions} {...cardProps} />

      <button className='save-button' disabled={isSubmitting} type='submit'>
        {saveButtonText}
      </button>
    </form>
  );
}

export interface PaymentSubmissionProps
  extends Omit<ManagerProps, 'clientSecret'> {
  /**
   * An API token with permissions for a specific customer.
   */
  customerToken: string;
  onSubmit?: () => void;
}

export function PaymentSubmission({
  customerToken,
  onSubmit,
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
          onSubmit={onSubmit}
          {...managerProps}
        />
      </Elements>
    </TokenProvider>
  );
}

PaymentSubmission.propTypes = {
  customerToken: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
};
