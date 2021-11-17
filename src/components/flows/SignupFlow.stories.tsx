import type { Meta, Story } from '@storybook/react';
import SignupFlow from 'components/flows/SignupFlow';
import { PaymentSubmissionProps } from 'components/payment/PaymentSubmission';
import 'components/payment/PaymentSubmission.css';
import { TokenProvider } from 'hooks/useCustomerToken';
import React from 'react';
import withMock from 'storybook-addon-mock';

const config: Meta = {
  title: 'Octane/SignupFlow',
  component: SignupFlow,
  decorators: [withMock],
};

const Template: Story<PaymentSubmissionProps> = (args) => (
  <TokenProvider customerName={args.customerName} token={args.customerToken}>
    <SignupFlow {...args} />
  </TokenProvider>
);

export const Default = Template.bind({});
// TODO: Remove defaults; figure out how to generate mats autogically.
Default.args = {
  customerToken: '{{CUSTOMER TOKEN GOES HERE}}',
  customerName: 'generic-stripe-customer-0',
};

export default config;