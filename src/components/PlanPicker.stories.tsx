import React from 'react';
import PricePlans from 'components/PlanPicker';
import withMock from 'storybook-addon-mock';
import type { Props } from 'components/PlanPicker';
import type { Story, Meta } from '@storybook/react';

const config: Meta = {
  title: 'Octane/PricePlans',
  component: PricePlans,
  decorators: [withMock],
};

const Template: Story<Props> = (args: Props) => <PricePlans {...args} />;

export const Default = Template.bind({});
Default.args = {
  customerToken: 'primary token',
};

Default.parameters = {
  mockData: [
    {
      url: 'https://api.cloud.getoctane.io/price_plans/',
      method: 'GET',
      status: 200,
      response:
        /* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/camelcase */
        [
          {
            name: 'plans_standard_with_storage',
            display_name: 'Standard Plan w/ storage',
            description:
              'Same rates as standard plan. Additionally, metered usage for managed storage component is included.',
            base_price: 1000,
            period: 'month',
            coupon: {
              name: 'flat_discount_coupon',
            },
            metered_components: [
              {
                meter_name: 'storage_photos',
                price_scheme: {
                  display_name: '[Media] Storage Prices (volume-based)',
                  name: 'media_storage_volume_prices',
                  scheme_type: 'string',
                  prices: [
                    {
                      price: 350,
                      cap: 20,
                    },
                  ],
                  time_unit_name: 'month',
                  unit_name: 'gigabyte',
                },
                limit: 0,
              },
            ],
            discount: {
              discount_type: 'string',
              amount: 15,
              start_date: '2021-11-04T22:40:49.995Z',
              end_date: '2021-11-04T22:40:49.995Z',
              coupon_id: 0,
            },
            features: [
              {
                description: 'Some really cool feature description',
                name: 'super_cool_feature',
                display_name: 'Super Cool Feature',
              },
            ],
            limits: [
              {
                feature: {
                  description: 'Some really cool feature description',
                  name: 'super_cool_feature',
                  display_name: 'Super Cool Feature',
                },
                limit: 2,
              },
            ],
            tags: [
              {
                tag: 'production',
              },
            ],
            trial: {
              time_length: 1,
              time_unit_name: 'week',
              credit: 1000,
            },
          },
        ],
      /* eslint-enable @typescript-eslint/naming-convention, @typescript-eslint/camelcase */
    },
  ],
};

export const Variation1 = Template.bind({});
Variation1.args = {
  customerToken: 'secondary token',
};

export default config;
