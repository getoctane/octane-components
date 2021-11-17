import type { Meta, Story } from '@storybook/react';
import PaymentSubmission, {
  PaymentSubmissionProps,
} from 'components/payment/PaymentSubmission';
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
  <TokenProvider customerName={args.customerName} token={args.customerToken}>
    <PaymentSubmission {...args} />
  </TokenProvider>
);

export const Default = Template.bind({});
Default.args = {
  customerToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZW5kb3JfaWQiOjE4MCwiY3VzdG9tZXJfaWQiOjU0MSwiaWF0IjoxNjM3MTMwMTE3LCJleHAiOjE2MzcxMzM3MTd9.Hv0Wbff9qv6V_azUfpnXNYcHQMH8GXNZzwA3-Mi6qjo',
  customerName: 'generic-stripe-customer-0',
};

export default config;
