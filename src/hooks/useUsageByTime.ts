import { useCallback, useContext, useMemo } from 'react';
import { useAsync } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerUsageBytime from '../actions/getUsageByTime';

type CustomerUsageByTimeInput =
  components['schemas']['CustomerPortalUsageByTimeInput'];

/**
 * @description
 * A `useUsageByTime` hook to fetch and refetch a customer's daily usage data.
 *
 * @example
 * const { result, loading, error, refetch } = useUsageByTime({
 *   token, payload: { meter_name: 'user', start_time: '2023-09-01T00:00:00.000Z' }
 * });
 */
export const useUsageByTime = (args?: {
  payload?: CustomerUsageByTimeInput;
  token?: string;
  baseApiUrl?: string;
}) => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  const initialArgs: [CustomerUsageByTimeInput | undefined] = useMemo(
    () => [args?.payload],
    [args?.payload]
  );

  const fetchFn = useCallback(
    (payload?: CustomerUsageByTimeInput) => {
      if (payload == null) {
        return Promise.resolve(null);
      }
      return getCustomerUsageBytime(userToken, payload, { baseApiUrl });
    },
    [userToken, baseApiUrl]
  );

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  return useAsync({ fetchFn, initialArgs });
};
