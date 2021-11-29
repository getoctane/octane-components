import React, { useState } from 'react';
import { PlanPicker, PaymentSubmission } from 'octane-components';
import type { PricePlan } from 'octane-components';

interface Props {
  token: string;
}

const App = ({ token }: Props): JSX.Element => {
  const [hasSelected, setHasSelected] = useState<boolean>(false);

  // When any plan has been selected, show the PaymentSubmission
  const onPlanSelect = (_: string, plan: PricePlan): void => {
    setHasSelected(plan != null);
  };

  return (
    <div>
      <PlanPicker customerToken={token} onPlanSelect={onPlanSelect} />
      {hasSelected && <PaymentSubmission customerToken={token} />}
    </div>
  );
};

export default App;
