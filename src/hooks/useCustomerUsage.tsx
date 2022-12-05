import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCusomerUsage from '../actions/getUsage';

type CustomerUsage = components['schemas']['CustomerPortalUsage'];

export type UseCustomerUsageReturnType = UseAsyncReturnType<CustomerUsage>;

/**
 * A hook that fetches the customer's usage.
 */
export const useCustomerUsage = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseCustomerUsageReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const asyncFunc = useCallback(() => {
    return getCusomerUsage(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync(asyncFunc);
};
