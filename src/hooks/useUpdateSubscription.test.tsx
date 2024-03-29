/* eslint-disable dot-notation */
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { enableFetchMocks } from 'jest-fetch-mock';

import * as subscribeCustomer from 'actions/subscribeCustomer';
import { TokenProvider } from './useCustomerToken';
import { useUpdateSubscription } from './useUpdateSubscription';
import type {
  ActivePricePlan,
  ActiveSubscriptionInputArgs,
} from './useUpdateSubscription';
import type { UseAsyncOnDemandResultType } from './useAsyncOnDemand';

enableFetchMocks();
fetchMock.enableMocks();

const mockPricePlanInfo = {
  price_plan_uuid: '12345',
  add_ons: [],
};

let hookResult: UseAsyncOnDemandResultType<ActivePricePlan> | null;
let funcToExecute: ((ppInfo: ActiveSubscriptionInputArgs) => void) | null =
  null;

const MockComponent = (props: {
  token?: string;
  ppInfo: ActiveSubscriptionInputArgs;
}): JSX.Element => {
  const [mutation, result] = useUpdateSubscription({
    token: props?.token,
  });

  hookResult = result;
  funcToExecute = mutation;

  return (
    <button onClick={() => mutation(props.ppInfo)}>
      Click to call mutation
    </button>
  );
};

describe('useUpdateSubscription hook', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
  });

  beforeEach(() => {
    fetchMock.once(JSON.stringify({ price_plan: mockPricePlanInfo }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
    hookResult = null;
    funcToExecute = null;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('is called correctly and returns initial result with function to execute', async () => {
    const mockToken = '12345';

    render(
      <TokenProvider token={mockToken}>
        <MockComponent ppInfo={mockPricePlanInfo} />
      </TokenProvider>
    );

    await waitFor(() =>
      expect(hookResult).toEqual({
        result: null,
        error: null,
        loading: false,
        status: 'UNSENT',
      })
    );
    expect(funcToExecute).not.toBeNull();
  });

  it('is called correctly and executeble function returns correct result', async () => {
    const mockToken = '12345';
    const spy = jest.spyOn(subscribeCustomer, 'default');

    render(<MockComponent token={mockToken} ppInfo={mockPricePlanInfo} />);
    await waitFor(() => expect(funcToExecute).not.toBeNull());

    // Call mutation returned from the hook
    userEvent.click(screen.getByText('Click to call mutation'));

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith(mockToken, mockPricePlanInfo, {
        baseApiUrl: undefined,
      })
    );
    expect(hookResult).toEqual({
      loading: false,
      error: null,
      result: {
        price_plan: mockPricePlanInfo,
      },
      status: 'DONE',
    });
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0]?.[1]?.headers?.['Authorization']).toBe(
      `Bearer ${mockToken}`
    );
  });

  it("should throw an error, if customer's token isn't provided at all", async () => {
    expect(() =>
      render(
        <TokenProvider token=''>
          <MockComponent ppInfo={mockPricePlanInfo} />
        </TokenProvider>
      )
    ).toThrow(Error('Token must be provided.'));
  });
});
