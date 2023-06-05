import { useCallback, useContext } from 'react';
import { useAsyncOnDemand } from './useAsyncOnDemand';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCusomerUsage from '../actions/getUsage';

type CustomerPortalMeterLabelFilter =
  components['schemas']['CustomerPortalMeterLabelFilter'];

/**
 * @deprecated use `useUsage` hook instead.
 * It extends a functionality of `useCustomerUsage` and provide `refetch` function.
 * Look `hooks/useUsage` for more details.
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
