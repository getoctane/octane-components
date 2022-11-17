import { useCallback, useContext } from 'react';
import { TokenContext } from './useCustomerToken';
import { useAsyncOnDemand } from './useAsyncOnDemand';
import type { UseAsyncOnDemandReturnType } from './useAsyncOnDemand';
import { createStripeSetupIntent } from '../api/octane';
import { components } from '../apiTypes';

export type StripeSetupIntent =
  components['schemas']['CustomerPortalStripeCredential'];

export const useStripeSetupIntent = (args?: {
  token?: string;
  baseApiUrl?: string;
}): UseAsyncOnDemandReturnType<StripeSetupIntent> => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;
  const baseApiUrl = args?.baseApiUrl;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const mutation = useCallback(() => {
    return createStripeSetupIntent({
      token: userToken,
      urlOverride: baseApiUrl,
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error(`An error occurred: ${result.statusText}`);
        }
        return result.json();
      })
      .then((data) => data);
  }, [baseApiUrl, userToken]);

  return useAsyncOnDemand(mutation);
};
