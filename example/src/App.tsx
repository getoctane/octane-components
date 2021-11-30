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
  const [hasBilling, setHasBilling] = useState<boolean>(false);

  // When any plan has been selected, show the PaymentSubmission
  const onPlanSelect = useCallback(
    (_: string, plan: PricePlan): void => {
      setSelectedPlan(plan);
    },
    [setSelectedPlan]
  );

  const onBillingSubmit = useCallback((): void => {
    setHasBilling(true);
  }, [setHasBilling]);

  const onSubscribe = useCallback((): void => {
    subscribeCustomer(token, selectedPlan.name).then(
      (data: ActiveSubscription) => {
        alert(
          `Customer has been subscribed to ${data.price_plan.display_name}`
        );
        // eslint-disable-next-line no-console
        console.log('subscription data', data);
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
          onSubmit={onBillingSubmit}
          // onBillingSet
          options={stripeOptions}
        />
      )}
      {hasBilling && (
        <button className='subscribe' onClick={onSubscribe}>
          Click here to subscribe
        </button>
      )}
      <div>
        <h2>Internal state</h2>
        <div>
          Has a plan selected:{' '}
          {selectedPlan ? `yes ${selectedPlan.display_name}` : 'no'}
        </div>
        <div>Has submitted billing data: {hasBilling ? 'yes' : 'no'}</div>
      </div>
    </div>
  );
};

export default App;
