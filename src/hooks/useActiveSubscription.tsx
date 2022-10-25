import { useCallback, useContext } from 'react';
import getActiveSubscription from 'actions/getActiveSubscription';
import useAsync from 'hooks/useAsync';
import { TokenContext } from 'hooks/useCustomerToken';
import { components } from '../apiTypes';

type PricePlan = components['schemas']['PricePlan'];

export type UseActiveSubscriptionReturnType = {
  result: PricePlan | null;
  loading: boolean;
  error: unknown;
};

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

  const result = useAsync(asyncFunc);

  return result;
};

export default useActiveSubscription;
