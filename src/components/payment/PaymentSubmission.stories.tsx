import type { Meta, Story } from '@storybook/react';
import {
  PaymentSubmissionProps,
  PaymentSubmission,
} from 'components/payment/PaymentSubmission';
import 'components/globals.css';
import 'components/payment/PaymentSubmission.css';
import { TokenProvider } from 'hooks/useCustomerToken';
import React from 'react';
import withMock from 'storybook-addon-mock';

const config: Meta = {
  title: 'Octane/PaymentSubmission',
  component: PaymentSubmission,
  decorators: [withMock],
};

const Template: Story<PaymentSubmissionProps> = (args) => (
  <TokenProvider token={args.customerToken}>
    <PaymentSubmission {...args} />
  </TokenProvider>
);

export const Default = Template.bind({});
Default.args = {
  customerToken: '<<YOUR_CUSTOMER_TOKEN>>',
};

export default config;
