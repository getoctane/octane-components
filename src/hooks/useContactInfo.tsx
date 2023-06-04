import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncFetchReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerContactInfo from '../actions/getContactInfo';

type ContactInfo = components['schemas']['ContactInfo'];

export type UseContactInfoReturnType = UseAsyncFetchReturnType<ContactInfo>;

/**
 * A hook that fetches the customer's contact info.
 */
export const useContactInfo = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseContactInfoReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const asyncFunc = useCallback(() => {
    return getCustomerContactInfo(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync(asyncFunc);
};
