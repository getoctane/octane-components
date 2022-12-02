import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerVendorInfo from '../actions/getVendorInfo';

type VendorInfo = components['schemas']['VendorInfo'];

export type UseVendorInfoReturnType = UseAsyncReturnType<VendorInfo>;

/**
 * A hook that fetches the customer's contact info.
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

  const asyncFunc = useCallback(() => {
    return getCustomerVendorInfo(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync(asyncFunc);
};
