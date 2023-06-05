import { useCallback, useContext } from 'react';
import { useAsync } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCusomerUsage from '../actions/getUsage';

type CustomerPortalMeterLabelFilter =
  components['schemas']['CustomerPortalMeterLabelFilter'];

/**
 * A hook that fetches the customer's usage.
 */
export const useUsage = (args?: {
  meterFilter?: CustomerPortalMeterLabelFilter;
  token?: string;
  baseApiUrl?: string;
}) => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const fetchFn = useCallback(
    (meterFilter?: CustomerPortalMeterLabelFilter) => {
      if (meterFilter == null) {
        return Promise.resolve(null);
      }
      return getCusomerUsage(userToken, meterFilter, { baseApiUrl });
    },
    [userToken, baseApiUrl]
  );

  return useAsync({ fetchFn, initialArgs: [args?.meterFilter] });
};
