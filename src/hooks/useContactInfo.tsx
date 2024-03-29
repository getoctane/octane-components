import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncFetchAndUpdateReturnType } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerContactInfo from '../actions/getContactInfo';
import updateCustomerContactInfo from '../actions/updateContactInfo';

type ContactInfo = components['schemas']['ContactInfo'];
export type ContactInfoInputArgs =
  components['schemas']['ContactInfoInputArgs'];

export type UseContactInfoReturnType = UseAsyncFetchAndUpdateReturnType<
  ContactInfo,
  [],
  [ContactInfoInputArgs]
>;

/**
 * @description
 * A `useContactInfo` hook to fetch, refetch, and update a customer's contact info.
 *
 * @example
 * const { result, loading, error, refetch, update } = useContactInfo({ token });
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

  const fetchFn = useCallback(() => {
    return getCustomerContactInfo(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  const updateFn = useCallback(
    (contactInfoToUpdate: ContactInfoInputArgs) => {
      if (!contactInfoToUpdate) {
        throw new Error('Contact info object must be provided.');
      }

      return updateCustomerContactInfo(userToken, contactInfoToUpdate, {
        baseApiUrl,
      });
    },
    [userToken, baseApiUrl]
  );

  return useAsync({ fetchFn, updateFn });
};
