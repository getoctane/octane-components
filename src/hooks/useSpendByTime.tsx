import { useCallback, useContext, useMemo } from 'react';
import { useAsync } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerSpendByTime from '../actions/getCustomerSpendByTime';

type CustomerSpendByTimeInput =
  components['schemas']['CustomerPortalSpendByTimeInput'];

/**
 * @description
 * A hook that fetches customer's spend by time data.
 * @example
 * const { result, loading, error, refetch } = useSpendByTime({ token, payload: { start_time: '2023-09-01T00:00:00.000Z' } });
 */
export const useSpendByTime = (args?: {
  token?: string;
  payload?: CustomerSpendByTimeInput;
  baseApiUrl?: string;
}) => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  const initialArgs: [CustomerSpendByTimeInput | undefined] = useMemo(
    () => [args?.payload],
    [args?.payload]
  );

  const fetchFn = useCallback(
    (payload?: CustomerSpendByTimeInput) => {
      if (!payload) {
        return Promise.resolve(null);
      }
      return getCustomerSpendByTime(userToken, payload, { baseApiUrl });
    },
    [userToken, baseApiUrl]
  );

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  return useAsync({ fetchFn, initialArgs });
};
