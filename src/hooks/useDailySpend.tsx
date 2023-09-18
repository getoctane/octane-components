import { useCallback, useContext, useMemo } from 'react';
import { useAsync } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerDailySpend from '../actions/getCustomerDailySpend';

type CustomerDailySpendInput =
  components['schemas']['CustomerPortalSpendByTimeInput'];

/**
 * @description
 * A hook that fetches customer's daily spend data.
 * @example
 * const { result, loading, error, refetch } = useDailySpend({ token, payload: { start_time: '2023-09-01T00:00:00.000Z' } });
 */
export const useDailySpend = (args?: {
  token?: string;
  payload?: CustomerDailySpendInput;
  baseApiUrl?: string;
}) => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  const initialArgs: [CustomerDailySpendInput | undefined] = useMemo(
    () => [args?.payload],
    [args?.payload]
  );

  const fetchFn = useCallback(
    (payload?: CustomerDailySpendInput) => {
      if (!payload) {
        return Promise.resolve(null);
      }
      return getCustomerDailySpend(userToken, payload, { baseApiUrl });
    },
    [userToken, baseApiUrl]
  );

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  return useAsync({ fetchFn, initialArgs });
};
