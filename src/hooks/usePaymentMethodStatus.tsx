import { useCallback, useContext } from 'react';
import getPaymentMethodStatus from 'actions/getPaymentMethodStatus';
import { useAsync } from 'hooks/useAsync';
import type { UseAsyncReturnType } from 'hooks/useAsync';
import { TokenContext } from 'hooks/useCustomerToken';
import { components } from '../apiTypes';

type CustomerPaymentMethodStatus =
  components['schemas']['CustomerPaymentMethodStatus'];
export type UsePaymentMethodStatusReturnType =
  UseAsyncReturnType<CustomerPaymentMethodStatus>;

/**
 * A hook that fetches customer's payment method status.
 */
export const usePaymentMethodStatus = (args?: {
  token?: string;
}): UsePaymentMethodStatusReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const asyncFunc = useCallback(() => {
    return getPaymentMethodStatus(userToken);
  }, [userToken]);

  return useAsync(asyncFunc);
};
