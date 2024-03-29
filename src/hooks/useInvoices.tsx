import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import getInvoices from '../actions/getInvoices';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';

type Invoices = components['schemas']['CustomerPortalInvoice'][];

export type UseInvoicesReturnType = UseAsyncFetchReturnType<Invoices>;

/**
 * @description
 * A hook to fetch a customer's invoices.
 *
 * @example
 * const { result, loading, error, refetch } = useInvoices({ token });
 */
export const useInvoices = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseInvoicesReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(() => {
    return getInvoices(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
