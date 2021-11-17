import 'components/flows/SignupFlow.css';
import PaymentSubmission from 'components/payment/PaymentSubmission';
import PlanPicker from 'components/PlanPicker';
import React from 'react';
import {
  billingInfoProvided,
  existingSubscription,
  selectedPricePlan,
} from 'utils/sharedState';

interface Props {
  customerName: string;
  customerToken: string;
}

const SignupFlow = ({ customerName, customerToken }: Props): JSX.Element => {
  if (existingSubscription.get() == null) {
    return (
      <PlanPicker customerName={customerName} customerToken={customerToken} />
    );
  }

  if (!billingInfoProvided.get()) {
    return (
      <PaymentSubmission
        customerName={customerName}
        customerToken={customerToken}
      />
    );
  }

  return (
    <div className='octane-component signup-flow-root'>
      <div className='customer-metadata'>
        <div className='octane-component customer-name'>{customerName}</div>

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

export default SignupFlow;
