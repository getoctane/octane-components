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
  <TokenProvider token={args.customerToken}>
    <SignupFlow {...args} />
  </TokenProvider>
);

export const Default = Template.bind({});
Default.args = {
  customerToken: '{{CUSTOMER TOKEN GOES HERE}}',
};

export default config;
