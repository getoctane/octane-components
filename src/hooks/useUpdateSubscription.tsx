import { useCallback, useContext } from 'react';
import { TokenContext } from './useCustomerToken';
import { useAsyncOnDemand } from './useAsyncOnDemand';
import subscribeCustomer from '../actions/subscribeCustomer';
import type { SubscribeCustomerOptions } from '../actions/subscribeCustomer';
import { components } from '../apiTypes';

type ActiveSubscriptionInputArgs =
  components['schemas']['CustomerPortalActiveSubscriptionInputArgs'];

type Props = {
  token?: string;
  baseApiUrl?: string;
  options?: SubscribeCustomerOptions;
};

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
