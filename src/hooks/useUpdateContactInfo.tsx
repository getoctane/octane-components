import { useCallback, useContext } from 'react';
import { TokenContext } from './useCustomerToken';
import { useAsyncOnDemand } from './useAsyncOnDemand';
import type { UseAsyncOnDemandReturnType } from './useAsyncOnDemand';
import updateCustomerContactInfo from '../actions/updateContactInfo';
import type { SubscribeCustomerOptions } from '../actions/subscribeCustomer';
import { components } from '../apiTypes';

export type ContactInfo = components['schemas']['ContactInfo'];
export type ContactInfoInput = components['schemas']['ContactInfoInputArgs'];

type Props = {
  token?: string;
  contactInfo: ContactInfoInput;
  baseApiUrl?: string;
  options?: SubscribeCustomerOptions;
};

export const useUpdateContactInfo = ({
  token,
  contactInfo,
  baseApiUrl,
  options = {},
}: Props): UseAsyncOnDemandReturnType<ContactInfo> => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = token || tokenFromContext;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  if (!contactInfo) {
    throw new Error('Contact info object must be provided.');
  }

  const mutation = useCallback(() => {
    return updateCustomerContactInfo(userToken, contactInfo, {
      ...options,
      baseApiUrl,
    });
  }, [userToken, contactInfo, options, baseApiUrl]);

  return useAsyncOnDemand(mutation);
};
