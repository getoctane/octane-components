/* eslint-disable dot-notation */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { enableFetchMocks } from 'jest-fetch-mock';
import { TokenProvider } from './useCustomerToken';
import { useActiveSubscription } from './useActiveSubscription';
import type { UseActiveSubscriptionReturnType } from './useActiveSubscription';
import * as getActiveSubscription from 'actions/getActiveSubscription';
import { components } from '../apiTypes';

enableFetchMocks();
fetchMock.enableMocks();

type ActiveSubscription =
  components['schemas']['CustomerPortalActiveSubscription'];

const subscriptionResponse: ActiveSubscription = {
  total_fixed_price: 100,
  invoicing_date: '2021-07-31',
  billing_cycle: {
    cycle_end: '2021-07-31',
    cycle_start: '2021-07-01',
  },
  subscription: {
    customer_name: 'Test Customer',
    price_plan_name: 'Test Plan',
    price_plan_uuid: '12345',
    add_ons: [],
    price_plan: {
      display_name: 'Test Price Plan',
      name: 'test_price_plan',
      period: 'quarter',
      base_price: 100,
      metered_components: [],
    },
    uuid: '12345',
  },
};

let hookResult: UseActiveSubscriptionReturnType | null;

const MockComponent = (props?: { token?: string }): JSX.Element => {
  const result = useActiveSubscription({
    token: props?.token,
  });

  hookResult = result;

  return <></>;
};

describe('useActiveSubscription hook', () => {
  beforeEach(() => {
    fetchMock.once(JSON.stringify(subscriptionResponse));
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
    hookResult = null;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('is called correctly with a token from context', async () => {
    const mockToken = '12345';
    const spy = jest.spyOn(getActiveSubscription, 'default');

    render(
      <TokenProvider token={mockToken}>
        <MockComponent />
      </TokenProvider>
    );

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith(mockToken, { baseApiUrl: undefined })
    );
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0]?.[1]?.headers?.['Authorization']).toBe(
      `Bearer ${mockToken}`
    );
    expect(hookResult?.result).toEqual(subscriptionResponse);
    expect(hookResult?.loading).toBeDefined();
    expect(hookResult?.error).toBeDefined();
  });

  it('is called correctly with token passed in directly', async () => {
    const mockToken = '54321';
    const spy = jest.spyOn(getActiveSubscription, 'default');

    render(<MockComponent token={mockToken} />);

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith(mockToken, { baseApiUrl: undefined })
    );
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0]?.[1]?.headers?.['Authorization']).toBe(
      `Bearer ${mockToken}`
    );

    expect(hookResult?.result).toEqual(subscriptionResponse);
    expect(hookResult?.loading).toBeDefined();
    expect(hookResult?.error).toBeDefined();
  });

  it('should prefer token, which passed in directly', async () => {
    const tokenAsArgument = '12345';
    const tokenFromContext = '54321';
    const spy = jest.spyOn(getActiveSubscription, 'default');

    render(
      <TokenProvider token={tokenFromContext}>
        <MockComponent token={tokenAsArgument} />
      </TokenProvider>
    );

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith(tokenAsArgument, {
        baseApiUrl: undefined,
      })
    );
    expect(fetchMock.mock.calls[0]?.[1]?.headers?.['Authorization']).toBe(
      `Bearer ${tokenAsArgument}`
    );
  });

  it("should throw an error, if customer's token isn't provided at all", async () => {
    /*
      React logs in console every thrown error.
      https://github.com/testing-library/testing-library-docs/issues/1060#issuecomment-1209695531
      By mocking `console.error` we don't allow React to show it in a console during test running
    */
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn());

    expect(() =>
      render(
        <TokenProvider token=''>
          <MockComponent />
        </TokenProvider>
      )
    ).toThrow(Error('Token must be provided.'));
  });
});
