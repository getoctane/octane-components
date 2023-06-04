import { useCallback, useContext } from 'react';
import getPaymentMethodStatus from '../actions/getPaymentMethodStatus';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';

type CustomerPaymentMethodStatus =
  components['schemas']['CustomerPaymentMethodStatus'];

export type UsePaymentMethodStatusReturnType =
  UseAsyncFetchReturnType<CustomerPaymentMethodStatus>;

/**
 * A hook that fetches customer's payment method status.
 */
export const usePaymentMethodStatus = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UsePaymentMethodStatusReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const asyncFunc = useCallback(() => {
    return getPaymentMethodStatus(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync(asyncFunc);
};
