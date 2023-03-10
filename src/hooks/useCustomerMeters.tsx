import { useCallback, useContext } from 'react';
import getCustomerMeters from '../actions/getCustomerMeters';
import { useAsync } from './useAsync';
import type { UseAsyncReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';

type CustomerPortalMeters = components['schemas']['CustomerPortalMeter'][];

export type UseMetersReturnType = UseAsyncReturnType<CustomerPortalMeters>;

/**
 * A hook that fetches all price plans associated with a vendor.
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

  const asyncFunc = useCallback(() => {
    return getCustomerMeters(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync(asyncFunc);
};
