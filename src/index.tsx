/**
 * The root of octane-components.
 */

// Types
import { components } from './apiTypes';

// Actions
import subscribeCustomer from './actions/subscribeCustomer';
import getActiveSubscription from './actions/getActiveSubscription';
import hasPaymentInfo from './actions/hasPaymentInfo';

// Hooks
export { useActiveSubscription } from './hooks/useActiveSubscription';
export { useHasPaymentInfo } from './hooks/useHasPaymentInfo';
export { usePaymentMethodStatus } from './hooks/usePaymentMethodStatus';
export { usePricePlans } from './hooks/usePricePlans';
export { useStripeSetupIntent } from './hooks/useStripeSetupIntent';
export { useUpdateSubscription } from './hooks/useUpdateSubscription';
export { useContactInfo } from './hooks/useContactInfo';
export { useInvoices } from './hooks/useInvoices';

export const Actions = {
  subscribeCustomer,
  getActiveSubscription,
  hasPaymentInfo,
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
export { TokenProvider } from './hooks/useCustomerToken';

// Types
export type SchemaTypes = components['schemas'];
