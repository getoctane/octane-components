import { useCallback, useContext, useMemo } from 'react';
import { useAsync } from './useAsync';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import getCustomerUsage from '../actions/getUsage';

type CustomerPortalMeterLabelFilter =
  components['schemas']['CustomerPortalMeterLabelFilter'];

/**
 * @description
 * A `useUsage` hook allow to fetch and refetch the customer's usage data.
 * @example
 * const { result, loading, error, refetch } = useUsage({
 *   token, meterFilter: { meterName: 'newMeter', label_filters: [] }
 * });
 */
export const useUsage = (args?: {
  meterFilter?: CustomerPortalMeterLabelFilter;
  token?: string;
  baseApiUrl?: string;
}) => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  const initialArgs: [CustomerPortalMeterLabelFilter | undefined] = useMemo(
    () => [args?.meterFilter],
    [args?.meterFilter]
  );

  const fetchFn = useCallback(
    (meterFilter?: CustomerPortalMeterLabelFilter) => {
      if (meterFilter == null) {
        return Promise.resolve(null);
      }
      return getCustomerUsage(userToken, meterFilter, { baseApiUrl });
    },
    [userToken, baseApiUrl]
  );

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  return useAsync({ fetchFn, initialArgs });
};
