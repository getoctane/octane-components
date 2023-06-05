import { useCallback, useContext, useMemo } from 'react';
import getActiveSubscription from '../actions/getActiveSubscription';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import subscribeCustomer from '../actions/subscribeCustomer';
import type { SubscribeCustomerOptions } from '../actions/subscribeCustomer';

type ActiveSubscription =
  components['schemas']['CustomerPortalActiveSubscription'];
export type ActivePricePlan =
  components['schemas']['CustomerPortalSubscription'];
export type ActiveSubscriptionInputArgs =
  components['schemas']['CustomerPortalActiveSubscriptionInputArgs'];

export type UseActiveSubscriptionReturnType =
  UseAsyncFetchReturnType<ActiveSubscription> & {
    update: (
      pricePlanInfo: ActiveSubscriptionInputArgs
    ) => Promise<ActivePricePlan>;
  };

/**
 * @description
 * A `useActiveSubscription` hook to fetch, refetch, and update the customer's active subscription.
 *
 * @example
 * const { result, loading, error, refetch, update } = useActiveSubscription({ token });
 */
export const useActiveSubscription = (args?: {
  token?: string;
  baseApiUrl?: string;
  options?: SubscribeCustomerOptions;
}): UseActiveSubscriptionReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;
  const options = useMemo(() => args?.options || {}, [args?.options]);

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(() => {
    return getActiveSubscription(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  const updateFn = useCallback(
    (pricePlanInfo: ActiveSubscriptionInputArgs) => {
      if (!pricePlanInfo?.price_plan_uuid) {
        throw new Error('Price plan uuid must be provided.');
      }

      return subscribeCustomer(userToken, pricePlanInfo, {
        ...options,
        baseApiUrl,
      });
    },
    [userToken, options, baseApiUrl]
  );

  const hook = useAsync({ fetchFn });
  return {
    ...hook,
    update: (pricePlanInfo: ActiveSubscriptionInputArgs) =>
      updateFn(pricePlanInfo).then((result) => {
        hook.refetch();
        return result;
      }),
  };
};
