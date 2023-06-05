import { useCallback, useContext } from 'react';
import getAllPricePlans from '../actions/getAllPricePlans';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';

type PricePlan = components['schemas']['PricePlan'];

export type UsePricePlansReturnType = UseAsyncFetchReturnType<PricePlan[]>;

/**
 * A hook that fetches all price plans associated with a vendor.
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
