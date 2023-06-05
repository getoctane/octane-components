import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import getCustomerLink from '../actions/getCustomerLink';
import { components } from 'apiTypes';
import { TokenContext } from './useCustomerToken';

type ContactLink = components['schemas']['CustomerPortalUrl'];
export type UseContactLinkReturnType = UseAsyncFetchReturnType<ContactLink>;

/**
 * A hook that fetches the link to a customer's portal.
 */
export const useCustomerLink = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseContactLinkReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error("Customer's token must be provided.");
  }

  const fetchFn = useCallback(() => {
    return getCustomerLink(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync({ fetchFn });
};
