import { useCallback, useContext } from 'react';
import getActiveSubscription from '../actions/getActiveSubscription';
import { useAsync } from './useAsync';
import type { UseAsyncReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';

type PricePlan = components['schemas']['PricePlan'];

export type UseActiveSubscriptionReturnType = UseAsyncReturnType<PricePlan>;

/**
 * A hook that fetches the customer's active subscription information.
 */
export const useActiveSubscription = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseActiveSubscriptionReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const asyncFunc = useCallback(() => {
    return getActiveSubscription(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync(asyncFunc);
};
