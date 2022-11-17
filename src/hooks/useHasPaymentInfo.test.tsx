/* eslint-disable dot-notation */
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { enableFetchMocks } from 'jest-fetch-mock';
import { VALID_PAYMENT_METHOD } from 'api/octane';
import * as getPaymentMethodStatus from 'actions/getPaymentMethodStatus';
import { useHasPaymentInfo } from './useHasPaymentInfo';
import { TokenProvider } from './useCustomerToken';

enableFetchMocks();
fetchMock.enableMocks();

const validStatus = {
  status: VALID_PAYMENT_METHOD,
};

const invalidStatus = {
  status: 'invalid',
};

let hookResult: boolean | null;

const MockComponent = (props?: { token?: string }): JSX.Element => {
  const result = useHasPaymentInfo({
    token: props?.token,
  });

  hookResult = result;

  return <></>;
};

describe('useHasPaymentInfo hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
    hookResult = null;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('returns `true` if status is valid', async () => {
    const mockToken = '12345';
    fetchMock.once(JSON.stringify(validStatus));
    const spy = jest.spyOn(getPaymentMethodStatus, 'default');

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
    expect(hookResult).toBeTruthy();
  });

  it('returns `false` if status is valid', async () => {
    const mockToken = '12345';
    fetchMock.once(JSON.stringify(invalidStatus));
    const spy = jest.spyOn(getPaymentMethodStatus, 'default');

    render(
      <TokenProvider token={mockToken}>
        <MockComponent />
      </TokenProvider>
    );

    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith(mockToken, { baseApiUrl: undefined })
    );
    expect(hookResult).toBeFalsy();
  });
});
