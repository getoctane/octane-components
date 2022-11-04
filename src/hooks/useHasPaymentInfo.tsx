import { usePaymentMethodStatus } from 'hooks/usePaymentMethodStatus';
import { VALID_PAYMENT_METHOD } from 'api/octane';

export const useHasPaymentInfo = (args?: { token?: string }): boolean => {
  const { result: paymentInfo } = usePaymentMethodStatus(args);
  return paymentInfo?.status === VALID_PAYMENT_METHOD;
};
