import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCreditLedger from '../actions/getCreditLedger';

type CreditLedger = components['schemas']['CreditLedger'][];

export type UseCreditLedgerReturnType = UseAsyncFetchReturnType<CreditLedger>;

/**
 * @description
 * A hook that fetches customer entire credit ledger.
 * @example
 * const { result, loading, error, refetch } = useCreditLedger({ token });
 */
export const useCreditLedger = (args?: {
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
    return getCreditLedger(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
