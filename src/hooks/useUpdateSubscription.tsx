import { useCallback, useContext } from 'react';
import { TokenContext } from 'hooks/useCustomerToken';
import { useAsyncOnDemand } from 'hooks/useAsyncOnDemand';
import type { UseAsyncOnDemandReturnType } from 'hooks/useAsyncOnDemand';
import subscribeCustomer from 'actions/subscribeCustomer';
import type { SubscribeCustomerOptions } from 'actions/subscribeCustomer';
import { components } from '../apiTypes';

export type ActiveSubscription =
  components['schemas']['CustomerPortalSubscription'];

type Props = {
  token?: string;
  pricePlanName: string;
  options?: SubscribeCustomerOptions;
};

const useUpdateSubscription = ({
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

export default useUpdateSubscription;
