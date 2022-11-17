import { useCallback, useContext } from 'react';
import getAllPricePlans from '../actions/getAllPricePlans';
import { useAsync } from './useAsync';
import type { UseAsyncReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';

type PricePlan = components['schemas']['PricePlan'];
type Options = {
  baseApiUrl?: string;
};

export type UsePricePlansReturnType = UseAsyncReturnType<PricePlan[]>;

/**
 * A hook that fetches all price plans associated with a vendor.
 */
export const usePricePlans = (args?: {
  token?: string;
  options?: Options;
}): UsePricePlansReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.options?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const asyncFunc = useCallback(() => {
    return getAllPricePlans(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync(asyncFunc);
};
