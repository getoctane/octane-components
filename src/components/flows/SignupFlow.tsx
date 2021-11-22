import 'components/flows/SignupFlow.css';
import PaymentSubmission from 'components/payment/PaymentSubmission';
import PlanPicker from 'components/PlanPicker';
import { TokenProvider } from 'hooks/useCustomerToken';
import React from 'react';
import {
  billingInfoProvided,
  existingSubscription,
  selectedPricePlan,
} from 'utils/sharedState';

interface SignupFlowContentProps {
  customerToken: string;
}

const SignupFlowContent = ({
  customerToken,
}: SignupFlowContentProps): JSX.Element => {
  if (existingSubscription.get() == null) {
    return <PlanPicker customerToken={customerToken} />;
  }

  if (!billingInfoProvided.get()) {
    return <PaymentSubmission customerToken={customerToken} />;
  }

  return (
    <div className='octane-component signup-flow-root'>
      <div className='customer-metadata'>
        <div>
          <b>Active Subscription:</b>{' '}
          {selectedPricePlan.get()?.display_name ?? 'No Active Subscription'}
        </div>
      </div>

      <div className='octane-component post-signup-footer'>
        <button className='post-signup-button'>Change Plan</button>
        <button className='post-signup-button'>Billing History</button>
      </div>
    </div>
  );
};

const SignupFlow = (props: SignupFlowContentProps): JSX.Element => {
  const { customerToken } = props;
  return (
    <TokenProvider token={customerToken}>
      <SignupFlowContent {...props} />
      <button
        onClick={() => {
          localStorage.clear();
        }}
      >
        Reset Demo state
      </button>
    </TokenProvider>
  );
};

export default SignupFlow;
