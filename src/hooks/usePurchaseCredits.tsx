import { useCallback, useContext } from 'react';
import { useAsyncOnDemand } from './useAsyncOnDemand';
import { TokenContext } from './useCustomerToken';
import { components } from '../apiTypes';
import purchaseCredits from '../actions/purchaseCredits';

type CustomerPortalCreditPurchaseInput =
  components['schemas']['CustomerPortalCreditPurchase'];

export const usePurchaseCredits = (args?: {
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
    (payload: CustomerPortalCreditPurchaseInput) => {
      return purchaseCredits(userToken, payload, { baseApiUrl });
    },
    [userToken, baseApiUrl]
  );

  return useAsyncOnDemand(asyncFunc);
};
