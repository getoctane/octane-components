import { useCallback, useContext } from 'react';
import { TokenContext } from './useCustomerToken';
import { useAsyncOnDemand } from './useAsyncOnDemand';
import subscribeCustomer from '../actions/subscribeCustomer';
import type { SubscribeCustomerOptions } from '../actions/subscribeCustomer';
import { components } from '../apiTypes';

export type ActivePricePlan =
  components['schemas']['CustomerPortalSubscription'];
export type ActiveSubscriptionInputArgs =
  components['schemas']['CustomerPortalActiveSubscriptionInputArgs'];

type Props = {
  token?: string;
  baseApiUrl?: string;
  options?: SubscribeCustomerOptions;
};

/**
 * @deprecated use `useActiveSubscription` hook instead.
 * It is more consistent with the other hooks in this package and provides
 * `refetch` and `update` functions. When `update` is called, it will refetch
 * to keep `result` value up to date. Please see `hooks/useActiveSubscription`
 * for more details.
 */
export const useUpdateSubscription = ({
  token,
  baseApiUrl,
  options = {},
}: Props) => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = token || tokenFromContext;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const mutation = useCallback(
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

  return useAsyncOnDemand(mutation);
};
