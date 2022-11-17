import { useCallback, useContext } from 'react';
import getPaymentMethodStatus from '../actions/getPaymentMethodStatus';
import { useAsync } from './useAsync';
import type { UseAsyncReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';

type CustomerPaymentMethodStatus =
  components['schemas']['CustomerPaymentMethodStatus'];
type Options = {
  baseApiUrl?: string;
};

export type UsePaymentMethodStatusReturnType =
  UseAsyncReturnType<CustomerPaymentMethodStatus>;

/**
 * A hook that fetches customer's payment method status.
 */
export const usePaymentMethodStatus = (args?: {
  token?: string;
  options?: Options;
}): UsePaymentMethodStatusReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.options?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const asyncFunc = useCallback(() => {
    return getPaymentMethodStatus(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync(asyncFunc);
};
