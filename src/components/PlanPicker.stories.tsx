import React from 'react';
import PlanPicker from 'components/PlanPicker';
import type { PlanPickerProps } from 'components/PlanPicker';
import withMock from 'storybook-addon-mock';
import type { Story, Meta } from '@storybook/react';
import 'components/PlanPicker.css';
import { components } from 'apiTypes';
import { getPricePlansUrl, getCustomerActiveSubscriptionUrl } from 'utils/api';
type PricePlan = components['schemas']['PricePlan'];
type MeteredComponent = components['schemas']['MeteredComponent'];

const config: Meta = {
  title: 'Octane/PlanPicker',
  component: PlanPicker,
  decorators: [withMock],
};

/**
 * Test cases to implement:
 *    1. No selection callback => make API request
 *    2. selection callback => don't make API request
 */

const mockMeteredComponents: MeteredComponent[] = [
  {
    limit: null,
    meter_name: 'processing_time',
    price_scheme: {
      display_name: null,
      name: null,
      prices: [{ cap: 3600.0, price: 3.0 }, { price: 1.0 }],
      scheme_type: 'PriceSchemeType.TIERED',
      time_unit_name: null,
      unit_name: 'second',
    },
  },
  {
    limit: 400.0,
    meter_name: 'storage',
    price_scheme: {
      display_name: null,
      name: null,
      prices: [{ price: 300.0 }],
      scheme_type: 'PriceSchemeType.FLAT',
      time_unit_name: null,
      unit_name: 'gigabyte',
    },
  },
  {
    limit: null,
    meter_name: 'storage',
    price_scheme: {
      display_name: null,
      name: null,
      prices: [{ cap: 100.0, price: 100000.0 }, { price: 200000.0 }],
      scheme_type: 'PriceSchemeType.STAIRSTEP',
      time_unit_name: null,
      unit_name: null,
    },
  },
  {
    limit: null,
    meter_name: 'storage',
    price_scheme: {
      display_name: null,
      name: null,
      prices: [{ price: 5.0 }],
      scheme_type: 'PriceSchemeType.VOLUME',
      time_unit_name: null,
      unit_name: 'byte',
    },
  },
];

const mockPricePlan: PricePlan = {
  name: 'plan2',
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
};

const mockActiveSubscription = {
  base_price_override: null,
  current_billing_cycle: {
    cycle_end: '2021-11-12T17:02:00.986000',
    cycle_start: '2021-10-12T17:02:00.986000',
  },
  customer_name: 'joey_pizza',
  discount_override: {
    amount: 25.0,
    coupon_id: 17,
    discount_type: 'PERCENT',
    end_date: null,
    start_date: '2021-08-12T17:02:00.986000',
  },
  effective_at: '2021-08-12T17:02:00.986000',
  price_plan: mockPricePlan,
  price_plan_name: 'basic',
  trial_override: null,
};

const Template: Story<PlanPickerProps> = (args) => <PlanPicker {...args} />;

export const Default = Template.bind({});
Default.args = {
  customerToken: 'primary token',
  customerName: 'joey_pizza',
};

Default.parameters = {
  mockData: [
    {
      url: getPricePlansUrl(),
      method: 'GET',
      status: 200,
      response: [
        { ...mockPricePlan, name: 'plan1' },
        {
          ...mockPricePlan,
          name: 'plan2',
          metered_components: mockMeteredComponents,
        },
        { ...mockPricePlan, name: 'plan3' },
      ],
    },
    {
      url: getCustomerActiveSubscriptionUrl(undefined, 'joey_pizza'),
      method: 'GET',
      status: 200,
      response: mockActiveSubscription,
    },
  ],
};

export default config;
