import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerCreditTopOffPlan from '../actions/getCreditTopOffPlan';

type CreditTopOffPlan = components['schemas']['CreditTopOffPlan'];

export type UseCreditTopOffPlanReturnType =
  UseAsyncFetchReturnType<CreditTopOffPlan>;

/**
 * @description
 * A hook that fetches customer credit top-off plan.
 * @example
 * const { result, loading, error, refetch } = useCreditTopOffPlan({ token });
 */
export const useCreditTopOffPlan = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseCreditTopOffPlanReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(() => {
    return getCustomerCreditTopOffPlan(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
