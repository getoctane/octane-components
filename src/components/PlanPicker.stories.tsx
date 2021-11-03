import React from 'react';
import PricePlans from 'components/PlanPicker';
import type { Props } from 'components/PlanPicker';
import type { Story, Meta } from '@storybook/react';

const config: Meta = {
  title: 'Octane/PricePlans',
  component: PricePlans,
};

const Template: Story<Props> = (args: Props) => <PricePlans {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  customerToken: 'primary token',
};

export const Secondary = Template.bind({});
Secondary.args = {
  customerToken: 'secondary token',
};

export default config;
