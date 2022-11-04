import { useCallback, useContext } from 'react';
import { TokenContext } from 'hooks/useCustomerToken';
import { useAsyncOnDemand } from 'hooks/useAsyncOnDemand';
import type { UseAsyncOnDemandReturnType } from 'hooks/useAsyncOnDemand';
import { createStripeSetupIntent } from 'api/octane';
import { components } from '../apiTypes';

export type StripeSetupIntent =
  components['schemas']['CustomerPortalStripeCredential'];

export const useStripeSetupIntent = (args?: {
  token?: string;
}): UseAsyncOnDemandReturnType<StripeSetupIntent> => {
  const { token: tokenFromContext } = useContext(TokenContext);
  const userToken = args?.token || tokenFromContext;

  if (!userToken) {
    throw new Error('Token must be provided.');
  }

  const mutation = useCallback(() => {
    return createStripeSetupIntent({
      token: userToken,
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error(`An error occurred: ${result.statusText}`);
        }
        return result.json();
      })
      .then((data) => data);
  }, [userToken]);

  return useAsyncOnDemand(mutation);
};
