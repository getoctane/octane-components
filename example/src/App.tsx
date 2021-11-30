import React, { useState, useCallback } from 'react';
import {
  PlanPicker,
  PaymentSubmission,
  subscribeCustomer,
} from 'octane-components';
import type { PricePlan } from 'octane-components';

interface Props {
  token: string;
}

const App = ({ token }: Props): JSX.Element => {
  const [hasSelected, setHasSelected] = useState<boolean>(false);
  const [hasBilling, setHasBilling] = useState<boolean>(false);

  // When any plan has been selected, show the PaymentSubmission
  const onPlanSelect = useCallback(
    (_: string, plan: PricePlan): void => {
      setHasSelected(plan != null);
    },
    [setHasSelected]
  );

  const onBillingSubmit = useCallback((): void => {
    setHasBilling(true);
  }, [setHasBilling]);

  const onSubscribe = useCallback((): void => {
    subscribeCustomer(token).then(() => {
      // eslint-disable-next-line no-console
      console.log('Customer has been subscribed');
    });
  }, [token]);

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
      {hasSelected && (
        <PaymentSubmission
          customerToken={token}
          onSubmit={onBillingSubmit}
          options={stripeOptions}
        />
      )}
      {hasBilling && (
        <button onClick={onSubscribe}>Click here to subscribe</button>
      )}
      <div>
        <h2>Internal state</h2>
        <div>Has a plan selected: {hasSelected ? 'yes' : 'no'}</div>
        <div>Has submitted billing data: {hasBilling ? 'yes' : 'no'}</div>
      </div>
    </div>
  );
};

export default App;
