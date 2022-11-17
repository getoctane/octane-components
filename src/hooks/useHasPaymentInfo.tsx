import { usePaymentMethodStatus } from './usePaymentMethodStatus';
import { VALID_PAYMENT_METHOD } from '../api/octane';

export const useHasPaymentInfo = (args?: {
  token?: string;
  baseApiUrl?: string;
}): boolean => {
  const { result: paymentInfo } = usePaymentMethodStatus(args);
  return paymentInfo?.status === VALID_PAYMENT_METHOD;
};
