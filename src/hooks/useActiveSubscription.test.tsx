/* eslint-disable dot-notation */
import React from 'react';
import { render, act } from '@testing-library/react';
import { enableFetchMocks } from 'jest-fetch-mock';
import { TokenProvider } from './useCustomerToken';
import useActiveSubscription from './useActiveSubscription';
import type { UseActiveSubscriptionReturnType } from './useActiveSubscription';
import * as getActiveSubscription from 'actions/getActiveSubscription';

enableFetchMocks();
fetchMock.enableMocks();

const mockPricePlan = {
  displayName: 'Test Price Plan',
  name: 'test_price_plan',
  period: 'quarter',
  basePrice: 100,
};

let hookResult: UseActiveSubscriptionReturnType | null;

const MockComponent = (props?: { token?: string }): JSX.Element => {
  const result = useActiveSubscription({
    token: props?.token,
  });

  hookResult = result;

  return <></>;
};

describe('Test `useActiveSubscription` hook', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    hookResult = null;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Test hook being called correctly with token provided', async () => {
    const mockToken = '12345';
    fetchMock.once(JSON.stringify({ price_plan: mockPricePlan }));
    const spy = jest.spyOn(getActiveSubscription, 'default');

    await act(async () => {
      render(
        <TokenProvider token={mockToken}>
          <MockComponent />
        </TokenProvider>
      );
    });

    expect(spy).toHaveBeenCalledWith(mockToken);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0]?.[1]?.headers?.['Authorization']).toBe(
      `Bearer ${mockToken}`
    );
    expect(hookResult?.result).toEqual(mockPricePlan);
    expect(hookResult?.loading).toBeDefined();
    expect(hookResult?.error).toBeDefined();
  });

  it('Test hook being called correctly with token passed directly', async () => {
    const mockToken = '54321';
    fetchMock.once(JSON.stringify({ price_plan: mockPricePlan }));
    const spy = jest.spyOn(getActiveSubscription, 'default');

    await act(async () => {
      render(<MockComponent token={mockToken} />);
    });

    expect(spy).toHaveBeenCalledWith(mockToken);
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0]?.[1]?.headers?.['Authorization']).toBe(
      `Bearer ${mockToken}`
    );
    expect(hookResult?.result).toEqual(mockPricePlan);
    expect(hookResult?.loading).toBeDefined();
    expect(hookResult?.error).toBeDefined();
  });
});
