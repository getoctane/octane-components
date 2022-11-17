import { useCallback, useContext } from 'react';
import { TokenContext } from './useCustomerToken';
import { useAsyncOnDemand } from './useAsyncOnDemand';
import type { UseAsyncOnDemandReturnType } from './useAsyncOnDemand';
import subscribeCustomer from '../actions/subscribeCustomer';
import type { SubscribeCustomerOptions } from '../actions/subscribeCustomer';
import { components } from '../apiTypes';

export type ActiveSubscription =
  components['schemas']['CustomerPortalSubscription'];

type Props = {
  token?: string;
  pricePlanName: string;
  options?: SubscribeCustomerOptions;
};

export const useUpdateSubscription = ({
  token,
  pricePlanName,
  options = {},
}: Props): UseAsyncOnDemandReturnType<ActiveSubscription> => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = token || tokenFromContext;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  if (!pricePlanName) {
    throw new Error('Price plan name must be provided.');
  }

  const mutation = useCallback(() => {
    return subscribeCustomer(userToken, pricePlanName, options);
  }, [userToken, pricePlanName, options]);

  return useAsyncOnDemand(mutation);
};
