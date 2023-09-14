import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerDailyAccruedRevenue from '../actions/getCustomerDailyAccruedRevenue';

type CustomerDailyAccruedRevenue =
  components['schemas']['CustomerPortalDailyAccruedRevenue'][];

export type UseDailyAccruedRevenueReturnType =
  UseAsyncFetchReturnType<CustomerDailyAccruedRevenue>;

/**
 * @description
 * A hook that fetches customer's daily accrued revenue data.
 * @example
 * const { result, loading, error, refetch } = useDailyAccruedRevenue({ token });
 */
export const useDailyAccruedRevenue = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseDailyAccruedRevenueReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(() => {
    return getCustomerDailyAccruedRevenue(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
