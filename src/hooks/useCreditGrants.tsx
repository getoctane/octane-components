import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerCreditGrants from '../actions/getCreditGrants';

type CreditGrants = components['schemas']['CustomerPortalCreditGrant'][];

export type UseCreditGrantsReturnType = UseAsyncFetchReturnType<CreditGrants>;

/**
 * @description
 * A hook that fetches customer credit grants.
 * @example
 * const { result, loading, error, refetch } = useCreditGrants({ token });
 */
export const useCreditGrants = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseCreditGrantsReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(() => {
    return getCustomerCreditGrants(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
