import { useCallback, useContext } from 'react';
import { TokenContext } from './useCustomerToken';
import { useAsyncOnDemand } from './useAsyncOnDemand';
import subscribeCustomer from '../actions/subscribeCustomer';
import type { SubscribeCustomerOptions } from '../actions/subscribeCustomer';
import { components } from '../apiTypes';

export type ActivePricePlan =
  components['schemas']['CustomerPortalSubscription'];

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
    (pricePlanName: string) => {
      if (!pricePlanName) {
        throw new Error('Price plan name must be provided.');
      }

      return subscribeCustomer(userToken, pricePlanName, {
        ...options,
        baseApiUrl,
      });
    },
    [userToken, options, baseApiUrl]
  );

  return useAsyncOnDemand(mutation);
};
