import { useCallback, useContext } from 'react';
import { TokenContext } from './useCustomerToken';
import { useAsync } from './useAsync';
import type { UseAsyncReturnType } from './useAsync';
import fetchSelfServeSettings from '../actions/getSelfServeSettings';
import { components } from '../apiTypes';

type SelfServeSettings = components['schemas']['SelfServeSettings'];
export type UseSelfServeSettingsReturnType =
  UseAsyncReturnType<SelfServeSettings>;

/**
 * A hook that fetches the vendor's self-serve settings.
 */
export const useSelfServeSettings = (args: {
  token?: string;
  baseApiUrl?: string;
}): UseSelfServeSettingsReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error("Customer's token must be provided.");
  }

  const asyncFunc = useCallback(() => {
    return fetchSelfServeSettings(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync(asyncFunc);
};