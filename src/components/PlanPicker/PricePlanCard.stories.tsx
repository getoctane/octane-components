import React from 'react';
import { PricePlanCard } from 'components/PlanPicker/PricePlanCard';
import type { PricePlanCardProps } from 'components/PlanPicker/PricePlanCard';
import type { Story, Meta } from '@storybook/react';
import 'components/globals.css';
import 'components/PlanPicker/PlanPicker.css';
import { components } from 'apiTypes';
type PricePlan = components['schemas']['PricePlan'];
type MeteredComponent = components['schemas']['MeteredComponent'];

const config: Meta = {
  title: 'Octane/PricePlanCard',
  component: PricePlanCard,
};

/**
 * Test cases to implement:
 *    1. Discounts
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
};

const Template: Story<PricePlanCardProps> = (args) => (
  <div className='octane-component'>
    <PricePlanCard {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  pricePlan: mockPricePlan,
};

export const MultipleMeters = Template.bind({});
MultipleMeters.args = {
  pricePlan: { ...mockPricePlan, metered_components: mockMeteredComponents },
};

export const NoBasePrice = Template.bind({});
NoBasePrice.args = {
  pricePlan: { ...mockPricePlan, base_price: null },
};

export default config;
