import { usePaymentMethodStatus } from './usePaymentMethodStatus';
import { VALID_PAYMENT_METHOD } from '../api/octane';

type Options = {
  baseApiUrl?: string;
};

export const useHasPaymentInfo = (args?: {
  token?: string;
  options: Options;
}): boolean => {
  const { result: paymentInfo } = usePaymentMethodStatus(args);
  return paymentInfo?.status === VALID_PAYMENT_METHOD;
};
