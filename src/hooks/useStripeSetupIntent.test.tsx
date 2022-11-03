/* eslint-disable dot-notation */
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { enableFetchMocks } from 'jest-fetch-mock';

import { TokenProvider } from './useCustomerToken';
import type { StripeSetupIntent } from 'hooks/useStripeSetupIntent';
import useStripeSetupIntent from 'hooks/useStripeSetupIntent';
import type { UseAsyncReturnType } from './useAsync';

enableFetchMocks();
fetchMock.enableMocks();

const mockStripeResponse = {
  account_id: 'test_account_id',
  client_secret: 'test_client_secret',
  publishable_key: 'test_publishable_key',
};

let hookResult: UseAsyncReturnType<StripeSetupIntent> | null;
let funcToExecute: (() => void) | null;

const MockComponent = (props?: { token?: string }): JSX.Element => {
  const [mutation, result] = useStripeSetupIntent({
    token: props?.token,
  });

  hookResult = result;
  funcToExecute = mutation;

  return <button onClick={mutation}>Click to call mutation</button>;
};

describe('useStripeSetupIntent hook', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => jest.fn());
  });

  beforeEach(() => {
    fetchMock.once(JSON.stringify(mockStripeResponse));
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
        <MockComponent />
      </TokenProvider>
    );

    await waitFor(() =>
      expect(hookResult).toEqual({
        result: null,
        error: null,
        loading: false,
      })
    );
    expect(funcToExecute).not.toBeNull();
  });

  it('is called correctly and executeble function returns correct result', async () => {
    const mockToken = '12345';

    render(<MockComponent token={mockToken} />);
    await waitFor(() => expect(funcToExecute).not.toBeNull());

    // Call mutation returned from the hook
    userEvent.click(screen.getByText('Click to call mutation'));

    await waitFor(() => expect(hookResult?.result).toEqual(mockStripeResponse));
    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0]?.[1]?.headers?.['Authorization']).toBe(
      `Bearer ${mockToken}`
    );
  });

  it("should throw an error, if customer's token isn't provided at all", async () => {
    expect(() =>
      render(
        <TokenProvider token=''>
          <MockComponent />
        </TokenProvider>
      )
    ).toThrow(Error('Token must be provided.'));
  });
});
