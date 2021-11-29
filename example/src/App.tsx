import React from 'react';
import { PlanPicker, PaymentSubmission } from 'octane-components';
import type { PricePlan } from 'octane-components';

interface Props {
  token: string;
}

function onPlanSelect(name: string, plan: PricePlan) {
  console.log(name, plan);
}

const App = ({ token }: Props) => {
  return (
    <div>
      <PlanPicker customerToken={token} onPlanSelect={onPlanSelect} />;
      <PaymentSubmission customerToken={token} />
    </div>
  );
};

export default App;
