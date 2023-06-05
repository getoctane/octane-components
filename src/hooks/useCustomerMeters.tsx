import { useCallback, useContext } from 'react';
import getCustomerMeters from '../actions/getCustomerMeters';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';

type CustomerPortalMeters = components['schemas']['CustomerPortalMeter'][];

export type UseMetersReturnType = UseAsyncFetchReturnType<CustomerPortalMeters>;

/**
 * @description
 * A hook that fetches all meters associated with a vendor's price plan.
 * @example
 * const { result, loading, error, refetch } = useMeters({ token });
 */
export const useMeters = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseMetersReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(() => {
    return getCustomerMeters(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
