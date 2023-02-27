import { useCallback, useContext } from 'react';
import { TokenContext } from './useCustomerToken';
import { useAsync } from './useAsync';
import type { UseAsyncReturnType } from './useAsync';
import { components } from '../apiTypes';
import fetchSelfServeCustomization from 'actions/getSelfServeCustomization';

type SelfServeCustomization = components['schemas']['SelfServeCustomization'];
export type UseSelfServeCustomizationReturnType =
  UseAsyncReturnType<SelfServeCustomization>;

/**
 * A hook that fetches the vendor's self-serve customization.
 */
export const useSelfServeCustomization = (args: {
  token?: string;
  baseApiUrl?: string;
}): UseSelfServeCustomizationReturnType => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error("Customer's token must be provided.");
  }

  const asyncFunc = useCallback(() => {
    return fetchSelfServeCustomization(userToken, { baseApiUrl });
  }, [userToken, baseApiUrl]);

  return useAsync(asyncFunc);
};