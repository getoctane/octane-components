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
 * It comes with `refetch` and `update` functions.
 * We don't want to create a separate state object for updated data,
 * because it's much difficult to work with.
 * Look `hooks/useContactInfo` for more details.
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
