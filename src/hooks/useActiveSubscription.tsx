import { useCallback, useContext } from 'react';
import getActiveSubscription from '../actions/getActiveSubscription';
import { useAsync } from './useAsync';
import type { UseAsyncReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';

type PricePlan = components['schemas']['PricePlan'];
type Options = {
  baseApiUrl?: string;
};

export type UseActiveSubscriptionReturnType = UseAsyncReturnType<PricePlan>;

/**
 * A hook that fetches the customer's active subscription information.
 */
export const useActiveSubscription = (args?: {
  token?: string;
  options: Options;
}): UseActiveSubscriptionReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.options?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const asyncFunc = useCallback(() => {
    return getActiveSubscription(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync(asyncFunc);
};
