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
import useActiveSubscription from 'hooks/useActiveSubscription';
import useHasPaymentInfo from 'hooks/useHasPaymentInfo';
import usePaymentMethodStatus from 'hooks/usePaymentMethodStatus';
import usePricePlans from 'hooks/usePricePlans';
import useStripeSetupIntent from 'hooks/useStripeSetupIntent';
import useUpdateSubscription from 'hooks/useUpdateSubscription';

export const Actions = {
  subscribeCustomer,
  getActiveSubscription,
  hasPaymentInfo,
};
export const Hooks = {
  useActiveSubscription,
  useHasPaymentInfo,
  usePaymentMethodStatus,
  usePricePlans,
  useStripeSetupIntent,
  useUpdateSubscription,
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
export type {
  UseAsyncReturnType,
  UseAsyncDelayedReturnType,
} from 'hooks/useAsync';
