import React, { useState } from 'react';
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
  const onPlanSelect = (_: string, plan: PricePlan): void => {
    setHasSelected(plan != null);
  };

  const onBillingSubmit = (): void => {
    setHasBilling(true);
  };
  const onSubscribe = (): void => {
    subscribeCustomer(token).then(() => {
      // eslint-disable-next-line no-console
      console.log('Customer has been subscribed');
    });
  };

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#8adb9a',
    },
  };

  const stripeOptions = { appearance };

  return (
    <div>
      <PlanPicker customerToken={token} onPlanSelect={onPlanSelect} />
      {hasSelected && (
        <PaymentSubmission
          customerToken={token}
          onSubmit={onBillingSubmit}
          stripeOptions={stripeOptions}
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
