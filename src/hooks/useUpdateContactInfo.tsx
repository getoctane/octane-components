import { useCallback, useContext } from 'react';
import { TokenContext } from './useCustomerToken';
import { useAsyncOnDemand } from './useAsyncOnDemand';
import updateCustomerContactInfo from '../actions/updateContactInfo';
import { components } from '../apiTypes';

export type ContactInfo = components['schemas']['ContactInfo'];
export type ContactInfoInput = components['schemas']['ContactInfoInputArgs'];

type Props = {
  token?: string;
  baseApiUrl?: string;
};

export const useUpdateContactInfo = ({ token, baseApiUrl }: Props) => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = token || tokenFromContext;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const mutation = useCallback(
    (contactInfoToUpdate: ContactInfoInput) => {
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
