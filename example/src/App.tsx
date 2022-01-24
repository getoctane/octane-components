import React, { useState, useCallback } from 'react';
import { PlanPicker, PaymentSubmission, Actions } from 'octane-components';

const { subscribeCustomer } = Actions;

interface Props {
  token: string;
}
function onError(err: unknown): void {
  console.error('Error!', err);
}

const App = ({ token }: Props): JSX.Element => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [hasPayment, setHasPayment] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);

  // When any plan has been selected, show the PaymentSubmission
  const onPlanSelect = useCallback(
    (plan: string): void => {
      setSelectedPlan(plan);
    },
    [setSelectedPlan]
  );

  // If a payment method is detected, show the "create subscription" button
  const onPaymentSet = useCallback((): void => {
    setHasPayment(true);
  }, [setHasPayment]);

  const onSubscribe = useCallback((): void => {
    if (selectedPlan === null) {
      return;
    }
    setIsSubscribing(true);
    subscribeCustomer(token, selectedPlan, { checkForBillingInfo: true }).then(
      (data) => {
        alert(
          `Customer has been subscribed to ${data.price_plan?.display_name}`
        );
        location.reload();
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
      <PlanPicker
        customerToken={token}
        onPlanSelect={onPlanSelect}
        onError={onError}
      />
      {selectedPlan != null && (
        <PaymentSubmission
          customerToken={token}
          onPaymentSet={onPaymentSet}
          options={stripeOptions}
          onError={onError}
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
          Has a plan selected: {selectedPlan ? `yes (${selectedPlan})` : 'no'}
        </div>
        <div>Has submitted billing data: {hasPayment ? 'yes' : 'no'}</div>
      </div>
    </div>
  );
};

export default App;
