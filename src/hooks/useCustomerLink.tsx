import { useCallback } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncReturnType } from './useAsync';
import getCustomerLink from '../actions/getCustomerLink';
import { components } from 'apiTypes';

type ContactLink = components['schemas']['CustomerPortalUrl'];
export type UseContactLinkReturnType = UseAsyncReturnType<ContactLink>;

/**
 * A hook that fetches the link to a customer's portal.
 */
export const useCustomerLink = (args: {
  token: string;
  baseApiUrl?: string;
}): UseContactLinkReturnType => {
  const { token, baseApiUrl } = args;

  if (!token) {
    throw new Error("Customer's token must be provided.");
  }

  const asyncFunc = useCallback(() => {
    return getCustomerLink(token, { baseApiUrl });
  }, [token, baseApiUrl]);

  return useAsync(asyncFunc);
};
