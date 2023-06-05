import { useCallback, useContext } from 'react';
import getPaymentMethodInfo from '../actions/getPaymentMethodInfo';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';

type CustomerPortalPaymentInfo =
  components['schemas']['CustomerPortalPaymentMethod'];

export type UsePaymentMehodInfoReturnType =
  UseAsyncFetchReturnType<CustomerPortalPaymentInfo>;

/**
 * @description
 * A hook that fetches the customer's payment method info.
 * @example
 * const { result, loading, error, refetch } = usePaymentMethodInfo({ token });
 */
export const usePaymentMethodInfo = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UsePaymentMehodInfoReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(() => {
    return getPaymentMethodInfo(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
