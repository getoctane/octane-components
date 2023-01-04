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
  apiKey: string;
  customerName: string;
  baseApiUrl?: string;
}): UseContactLinkReturnType => {
  const { apiKey, customerName, baseApiUrl } = args;

  if (!apiKey) {
    throw new Error('apiKey must be provided.');
  }

  if (!customerName) {
    throw new Error("Customer's name must be provided.");
  }

  const asyncFunc = useCallback(() => {
    return getCustomerLink(apiKey, customerName, { baseApiUrl });
  }, [apiKey, customerName, baseApiUrl]);

  return useAsync(asyncFunc);
};
