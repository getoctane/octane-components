import { useCallback, useContext } from 'react';
import { useAsyncOnDemand } from './useAsyncOnDemand';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCusomerUsage from '../actions/getUsage';

type CustomerPortalMeterLabelFilter =
  components['schemas']['CustomerPortalMeterLabelFilter'];

/**
 * A hook that fetches the customer's usage.
 */
export const useCustomerUsage = (args?: {
  token?: string;
  baseApiUrl?: string;
}) => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const asyncFunc = useCallback(
    (labelFilter: CustomerPortalMeterLabelFilter) => {
      return getCusomerUsage(userToken, labelFilter, { baseApiUrl });
    },
    [userToken, baseApiUrl]
  );

  return useAsyncOnDemand(asyncFunc);
};
