import { useCallback, useContext } from 'react';
import getAllPricePlans from '../actions/getAllPricePlans';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';

type PricePlan = components['schemas']['PricePlan'];

export type UsePricePlansReturnType = UseAsyncFetchReturnType<PricePlan[]>;

/**
 * @description
 * A hook to fetch the list of price plans available to a customer.
 *
 * @example
 * const { result, loading, error, refetch } = usePricePlans({ token });
 */
export const usePricePlans = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UsePricePlansReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(() => {
    return getAllPricePlans(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
