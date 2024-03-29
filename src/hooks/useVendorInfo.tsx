import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerVendorInfo from '../actions/getVendorInfo';

type VendorInfo = components['schemas']['CustomerPortalVendor'];

export type UseVendorInfoReturnType = UseAsyncFetchReturnType<VendorInfo>;

/**
 * @description
 * A hook that fetches data about the customer's vendor.
 * @example
 * const { result, loading, error, refetch } = useVendorInfo({ token });
 */
export const useVendorInfo = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseVendorInfoReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(() => {
    return getCustomerVendorInfo(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
