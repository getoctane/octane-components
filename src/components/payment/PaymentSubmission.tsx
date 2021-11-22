import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import {
  getSetupIntentClientSecret,
  StripeApiConfig,
  StripeApiFactory,
} from 'api/stripe';
import { components } from 'apiTypes';
import { TokenProvider } from 'hooks/useCustomerToken';
import useStripeCredential from 'hooks/useStripeCredential';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { billingInfoProvided } from 'utils/sharedState';

export type PricePlan = components['schemas']['PricePlan'];
export type MeteredComponent = components['schemas']['MeteredComponent'];

export interface PaymentSubmissionProps extends Partial<StripeApiConfig> {
  /**
   * An API token with permissions for a specific customer.
   */
  customerToken: string;
}

function PaymentSubmissionManager(): JSX.Element {
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
        const clientSecret = getSetupIntentClientSecret();
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
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [stripe, elements, isSubmitting]
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

export default function PaymentSubmission({
  customerToken,
  platformApiKey,
  stripeAccountId,
  ...managerProps
}: PaymentSubmissionProps): JSX.Element {
  useStripeCredential();
  const clientSecret = getSetupIntentClientSecret();

  return (
    <TokenProvider token={customerToken}>
      <Elements
        stripe={StripeApiFactory({ platformApiKey, stripeAccountId })}
        options={{ clientSecret }}
      >
        <PaymentSubmissionManager {...managerProps} />
      </Elements>
    </TokenProvider>
  );
}

PaymentSubmission.propTypes = {
  customerToken: PropTypes.string.isRequired,
  platformApiKey: PropTypes.string,
  stripeAccountId: PropTypes.string,
};
