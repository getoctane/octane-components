import { useCallback, useContext } from 'react';
import { TokenContext } from './useCustomerToken';
import { useAsyncOnDemand } from './useAsyncOnDemand';
import updateCustomerContactInfo from '../actions/updateContactInfo';
import { components } from '../apiTypes';

type ContactInfoInputArgs = components['schemas']['ContactInfoInputArgs'];

type Props = {
  token?: string;
  baseApiUrl?: string;
};

/**
 * @deprecated use `useContactInfo` hook instead.
 * It is more consistent with the other hooks in this package and provides
 * `refetch` and `update` functions. When `update` is called, it will keep the
 * `result` value up to date. Please see `hooks/useContactInfo` for more details.
 */
export const useUpdateContactInfo = ({ token, baseApiUrl }: Props) => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = token || tokenFromContext;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const mutation = useCallback(
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

  return useAsyncOnDemand(mutation);
};
