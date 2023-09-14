import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerTotalAccruedRevenue from '../actions/getCustomerTotalAccruedRevenue';

type CustomerTotalAccruedRevenue =
  components['schemas']['CustomerPortalAccruedRevenue'];

export type UseTotalAccruedRevenueReturnType =
  UseAsyncFetchReturnType<CustomerTotalAccruedRevenue>;

/**
 * @description
 * A hook that fetches customer's total accrued revenue data.
 * @example
 * const { result, loading, error, refetch } = useTotalAccruedRevenue({ token });
 */
export const useTotalAccruedRevenue = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseTotalAccruedRevenueReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(() => {
    return getCustomerTotalAccruedRevenue(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
