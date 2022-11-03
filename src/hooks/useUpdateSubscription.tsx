import { useCallback, useContext } from 'react';
import { TokenContext } from 'hooks/useCustomerToken';
import { useAsyncDelayed } from 'hooks/useAsync';
import type { UseAsyncDelayedReturnType } from 'hooks/useAsync';
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

const useUpdateSubscription = (
  props: Props
): UseAsyncDelayedReturnType<ActiveSubscription> => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const { token, pricePlanName, options = {} } = props;
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

  return useAsyncDelayed(mutation);
};

export default useUpdateSubscription;
