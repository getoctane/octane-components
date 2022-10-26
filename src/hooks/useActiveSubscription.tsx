import { useCallback, useContext } from 'react';
import getActiveSubscription from 'actions/getActiveSubscription';
import useAsync from 'hooks/useAsync';
import type { UseAsyncReturnType } from 'hooks/useAsync';
import { TokenContext } from 'hooks/useCustomerToken';
import { components } from '../apiTypes';

type PricePlan = components['schemas']['PricePlan'];
export type UseActiveSubscriptionReturnType = UseAsyncReturnType<PricePlan>;

/**
 * A hook that fetches the customer's active subscription information.
 */
const useActiveSubscription = (args?: {
  token?: string;
}): UseActiveSubscriptionReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);

  if (!args?.token && !tokenFromContext) {
    throw new Error('Token must be provided.');
  }

  const userToken = args?.token || tokenFromContext;

  const asyncFunc = useCallback(() => {
    return getActiveSubscription(userToken);
  }, [userToken]);

  return useAsync(asyncFunc);
};

export default useActiveSubscription;
