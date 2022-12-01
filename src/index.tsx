/**
 * The root of octane-components.
 */

// Types
import { components } from './apiTypes';

// Actions
import subscribeCustomer from './actions/subscribeCustomer';
import getActiveSubscription from './actions/getActiveSubscription';
import hasPaymentInfo from './actions/hasPaymentInfo';
import updateCustomerContactInfo from './actions/updateContactInfo';
import getAllPricePlans from './actions/getAllPricePlans';
import getContactInfo from './actions/getContactInfo';
import getInvoices from './actions/getInvoices';
import getPaymentMethodStatus from './actions/getPaymentMethodStatus';

// Hooks
export { useActiveSubscription } from './hooks/useActiveSubscription';
export { useHasPaymentInfo } from './hooks/useHasPaymentInfo';
export { usePaymentMethodStatus } from './hooks/usePaymentMethodStatus';
export { usePricePlans } from './hooks/usePricePlans';
export { useStripeSetupIntent } from './hooks/useStripeSetupIntent';
export { useUpdateSubscription } from './hooks/useUpdateSubscription';
export { useContactInfo } from './hooks/useContactInfo';
export { useInvoices } from './hooks/useInvoices';
export { useUpdateContactInfo } from './hooks/useUpdateContactInfo';

export const Actions = {
  subscribeCustomer,
  getActiveSubscription,
  hasPaymentInfo,
  updateCustomerContactInfo,
  getAllPricePlans,
  getContactInfo,
  getInvoices,
  getPaymentMethodStatus,
};

// Top-level API components. These only need a customer token and should
// otherwise Just Work™.
export { PlanPicker } from './components/PlanPicker/PlanPicker';
export { PaymentSubmission } from './components/PaymentSubmission/PaymentSubmission';

// Helper components (must be wrapped with TokenProvider)
export { MeteredComponent } from './components/PlanPicker/MeteredComponent';
export { PricePlanCard } from './components/PlanPicker/PricePlanCard';
export {
  StripeElements,
  useStripeClientSecret,
} from './components/PaymentSubmission/StripeElements';

// Token provider
export { TokenProvider, useCustomerToken } from './hooks/useCustomerToken';

// Types
export type SchemaTypes = components['schemas'];
