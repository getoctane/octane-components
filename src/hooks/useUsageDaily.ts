import { useCallback, useContext, useMemo } from 'react';
import { useAsync } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerDailyUsage from '../actions/getUsageDaily';

type CustomerDailyUsageInput =
  components['schemas']['CustomerPortalDailyUsageInput'];

/**
 * @description
 * A `useDailyUsage` hook to fetch and refetch a customer's daily usage data.
 *
 * @example
 * const { result, loading, error, refetch } = useDailyUsage({
 *   token, payload: { meter_name: 'user', start_time: '2023-09-01T00:00:00.000Z' }
 * });
 */
export const useDailyUsage = (args?: {
  payload?: CustomerDailyUsageInput;
  token?: string;
  baseApiUrl?: string;
}) => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  const initialArgs: [CustomerDailyUsageInput | undefined] = useMemo(
    () => [args?.payload],
    [args?.payload]
  );

  const fetchFn = useCallback(
    (payload?: CustomerDailyUsageInput) => {
      if (payload == null) {
        return Promise.resolve(null);
      }
      return getCustomerDailyUsage(userToken, payload, { baseApiUrl });
    },
    [userToken, baseApiUrl]
  );

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  return useAsync({ fetchFn, initialArgs });
};
