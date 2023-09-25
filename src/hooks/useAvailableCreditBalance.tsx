import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getAvailableCreditBalance from '../actions/getAvailableCreditBalance';

type AvailableCreditBalance =
  components['schemas']['CustomerPortalAvailableCreditBalance'];

export type UseCreditLedgerReturnType =
  UseAsyncFetchReturnType<AvailableCreditBalance>;

/**
 * @description
 * A hook that fetches customer available credit balance.
 * @example
 * const { result, loading, error, refetch } = useAvailableCreditBalance({ token });
 */
export const useAvailableCreditBalance = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseCreditLedgerReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(() => {
    return getAvailableCreditBalance(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
