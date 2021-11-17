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
  <TokenProvider token={args.customerToken}>
    <PaymentSubmission {...args} />
  </TokenProvider>
);

export const Default = Template.bind({});
// TODO: Remove defaults; figure out how to generate mats autogically.
Default.args = {
  customerToken: '<<YOUR_CUSTOMER_TOKEN>>',
};

export default config;
