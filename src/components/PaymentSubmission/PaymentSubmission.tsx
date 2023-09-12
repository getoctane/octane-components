import {
  CardElement,
  useElements,
  useStripe,
  CardElementProps,
} from '@stripe/react-stripe-js';
import hasPaymentInfo from '../../actions/hasPaymentInfo';
import { TokenProvider } from '../../hooks/useCustomerToken';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useEffect } from 'react';
import { StripeElements, useStripeClientSecret } from './StripeElements';

interface ManagerProps extends CardElementProps {
  onPaymentSet?: () => void;
  onError?: (err: unknown) => void;
  /**
   * Text to show on the "save payment" button. Defaults to "Save".
   */
  saveButtonText?: string;
}

function PaymentSubmissionManager({
  onPaymentSet: onSubmit,
  onError,
  saveButtonText = 'SAVE',
  options,
  ...cardProps
}: ManagerProps): JSX.Element {
  const stripe = useStripe();
  const elements = useElements();
  const clientSecret = useStripeClientSecret();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
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
        onError && onError(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [stripe, elements, isSubmitting, clientSecret, onSubmit, onError]
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
  baseApiUrl?: string;
}

export function PaymentSubmission({
  customerToken: token,
  onPaymentSet,
  baseApiUrl,
  ...managerProps
}: PaymentSubmissionProps): JSX.Element {
  const [isUpdatingPayment, setIsUpdatingPayment] = useState<boolean | null>(
    null
  );

  // Figure out if the customer has payment info on file or not.
  // If they do, we don't need to create a Stripe intent for them right away.
  useEffect(() => {
    hasPaymentInfo(token, { baseApiUrl }).then((hasIt) => {
      setIsUpdatingPayment(!hasIt);
      if (hasIt) {
        onPaymentSet && onPaymentSet();
      }
    });
  }, [token, setIsUpdatingPayment, onPaymentSet, baseApiUrl]);

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

  const loading = (
    <div className='octane-component present-payment-method'>
      <div className='details'>&nbsp;</div>
      <button className='update-payment-method' disabled>
        LOADING...
      </button>
    </div>
  );

  // Don't do anything until we know if the user has a payment method set up
  // or if we're waiting on creds before updating the payment method.
  if (isUpdatingPayment === null) {
    return loading;
  }

  const handleError = managerProps.onError;

  return (
    <>
      <TokenProvider token={token}>
        <StripeElements
          loading={loading}
          onError={handleError}
          baseApiUrl={baseApiUrl}
        >
          <PaymentSubmissionManager
            onPaymentSet={onPaymentSet}
            {...managerProps}
          />
        </StripeElements>
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
