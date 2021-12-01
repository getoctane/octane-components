import React, { useState, useCallback } from 'react';
import { PlanPicker, PaymentSubmission, Actions } from 'octane-components';
import type { SchemaTypes } from 'octane-components';

type PricePlan = SchemaTypes['PricePlan'];

const { subscribeCustomer } = Actions;

interface Props {
  token: string;
}

/**
 * This is temporary; until we publish octane-components on NPM, we can't access
 * types as we expect.
 */
interface ActiveSubscription {
  price_plan: {
    display_name: string;
  };
}

const App = ({ token }: Props): JSX.Element => {
  const [selectedPlan, setSelectedPlan] = useState<PricePlan | null>(null);
  const [hasPayment, setHasPayment] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);

  // When any plan has been selected, show the PaymentSubmission
  const onPlanSelect = useCallback(
    (_: string, plan: PricePlan): void => {
      setSelectedPlan(plan);
    },
    [setSelectedPlan]
  );

  // If a payment method is detected, show the "create subscription" button
  const onPaymentSet = useCallback((): void => {
    setHasPayment(true);
  }, [setHasPayment]);

  const onSubscribe = useCallback((): void => {
    setIsSubscribing(true);
    subscribeCustomer(token, selectedPlan.name, true).then(
      (data: ActiveSubscription) => {
        alert(
          `Customer has been subscribed to ${data.price_plan.display_name}`
        );
        // eslint-disable-next-line no-console
        console.log('subscription data', data);
        setIsSubscribing(false);
      }
    );
  }, [token, selectedPlan]);

  const cardStyle = {
    base: {
      color: '#ffffff',
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'avenir next', avenir, 'helvetica neue', helvetica, ubuntu, roboto, noto, 'segoe ui', arial, sans-serif",
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#d4f5f5',
      },
      ':disabled': {
        color: '#acacac',
      },
      iconColor: '#ffffff',
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  };

  const stripeOptions = { style: cardStyle };

  return (
    <div id='example-root'>
      <PlanPicker customerToken={token} onPlanSelect={onPlanSelect} />
      {selectedPlan != null && (
        <PaymentSubmission
          customerToken={token}
          onPaymentSet={onPaymentSet}
          options={stripeOptions}
        />
      )}
      {hasPayment && (
        <button
          className='subscribe'
          onClick={onSubscribe}
          disabled={isSubscribing}
        >
          Click here to subscribe
        </button>
      )}
      <div>
        <h2>Internal state</h2>
        <div>
          Has a plan selected:{' '}
          {selectedPlan ? `yes ${selectedPlan.display_name}` : 'no'}
        </div>
        <div>Has submitted billing data: {hasPayment ? 'yes' : 'no'}</div>
      </div>
    </div>
  );
};

export default App;
