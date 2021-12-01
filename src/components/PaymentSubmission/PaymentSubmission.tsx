import {
  CardElement,
  Elements,
  useElements,
  useStripe,
  CardElementProps,
} from '@stripe/react-stripe-js';
import { API_BASE } from 'config';
import { StripeApiFactory } from 'api/stripe';

import {
  createStripeSetupIntent,
  getPaymentMethodStatus,
  VALID_PAYMENT_METHOD,
} from 'api/octane';
import { components } from 'apiTypes';
import { TokenProvider } from 'hooks/useCustomerToken';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect } from 'react';
type CustomerPortalStripeCredential =
  components['schemas']['CustomerPortalStripeCredential'];

interface ManagerProps extends CardElementProps {
  clientSecret?: string;
  /**
   * A callback that fires whenever billing info has successfully submitted.
   */
  onPaymentSet?: () => void;
  /**
   * Text to show on the "save payment" button. Defaults to "Save".
   */
  saveButtonText?: string;
}

function PaymentSubmissionManager({
  clientSecret,
  onPaymentSet: onSubmit,
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
  onPaymentSet?: () => void;
}

export function PaymentSubmission({
  customerToken: token,
  onPaymentSet,
  ...managerProps
}: PaymentSubmissionProps): JSX.Element {
  const [isUpdatingPayment, setIsUpdatingPayment] = useState<boolean | null>(
    null
  );
  // const [hasPayment, setHasPayment] = useState<boolean | null>(null);
  const [creds, setCreds] = useState<CustomerPortalStripeCredential | null>(
    null
  );

  useEffect(() => {
    getPaymentMethodStatus({ token })
      .then((result) => {
        if (!result.ok) {
          throw new Error(
            `An error occurred fetching payment method status: ${result.statusText}`
          );
        }
        return result.json();
      })
      .then((data) => {
        const hasPayment = data.status === VALID_PAYMENT_METHOD;
        setIsUpdatingPayment(!hasPayment);
        if (hasPayment) {
          onPaymentSet && onPaymentSet();
        }
      });
  }, [token, setIsUpdatingPayment, onPaymentSet]);

  // Fetch a Stripe intent if we are updating the payment method.
  useEffect(() => {
    if (!isUpdatingPayment) {
      return;
    }
    createStripeSetupIntent({
      token,
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
  }, [token, isUpdatingPayment]);

  // If there's a payment method already, and we're not actively updating the
  // payment method, say as much.
  if (isUpdatingPayment === false) {
    return (
      <div className='octane-component present-payment-method'>
        <div className='details'>We have your payment information on file.</div>
        <button
          className='update-payment-method'
          onClick={() => setIsUpdatingPayment(true)}
        >
          UPDATE PAYMENT INFO
        </button>
      </div>
    );
  }

  // Don't do anything until we know if the user has a payment method set up
  // or if we're waiting on creds before updating the payment method.
  if (isUpdatingPayment === null || creds === null) {
    return (
      <div className='octane-component present-payment-method'>
        <div className='details'>&nbsp;</div>
        <button className='update-payment-method' disabled>
          LOADING...
        </button>
      </div>
    );
  }

  const {
    client_secret: clientSecret,
    publishable_key: platformApiKey,
    account_id: stripeAccount,
  } = creds;
  const stripe = StripeApiFactory({ platformApiKey, stripeAccount });

  return (
    <>
      <TokenProvider token={token}>
        <Elements stripe={stripe} options={{ clientSecret }}>
          <PaymentSubmissionManager
            clientSecret={clientSecret}
            onPaymentSet={onPaymentSet}
            {...managerProps}
          />
        </Elements>
      </TokenProvider>
    </>
  );
}

PaymentSubmission.propTypes = {
  customerToken: PropTypes.string.isRequired,
  onPaymentSet: PropTypes.func,
  saveButtonText: PropTypes.string,
  options: PropTypes.object,
  onChange: PropTypes.func,
  onReady: PropTypes.func,
  onEscape: PropTypes.func,
};
