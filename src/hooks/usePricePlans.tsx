import { useCallback, useContext } from 'react';
import getAllPricePlans from 'actions/getAllPricePlans';
import useAsync from 'hooks/useAsync';
import type { UseAsyncReturnType } from 'hooks/useAsync';
import { TokenContext } from 'hooks/useCustomerToken';
import { components } from '../apiTypes';

type PricePlan = components['schemas']['PricePlan'];
export type UsePricePlansReturnType = UseAsyncReturnType<PricePlan[]>;

/**
 * A hook that fetches all price plans associated with a vendor.
 */
const usePricePlans = (args?: { token?: string }): UsePricePlansReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);

  if (!args?.token && !tokenFromContext) {
    throw new Error('Token must be provided.');
  }

  const userToken = args?.token || tokenFromContext;

  const asyncFunc = useCallback(() => {
    return getAllPricePlans(userToken);
  }, [userToken]);

  return useAsync(asyncFunc);
};

export default usePricePlans;
