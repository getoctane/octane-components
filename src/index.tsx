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
import getVendorInfo from './actions/getVendorInfo';
import getCustomerUsage from './actions/getUsage';
import getPaymentMethodInfo from './actions/getPaymentMethodInfo';
import getLinkToCustomerPage from './actions/getCustomerLink';
import getSelfServeSettings from './actions/getSelfServeSettings';
import getSelfServeCustomization from './actions/getSelfServeCustomization';
import getCustomerMeters from './actions/getCustomerMeters';
import getCustomerTotalAccruedRevenue from './actions/getCustomerTotalAccruedRevenue';
import getCustomerSpendByTime from './actions/getCustomerSpendByTime';
import getCustomerUsageByTime from './actions/getUsageByTime';
import getCustomerCreditGrants from './actions/getCreditGrants';
import getCustomerAvailableCreditBalance from './actions/getAvailableCreditBalance';
import getCustomerCreditTopOffPlan from './actions/getCreditTopOffPlan';

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
export { useVendorInfo } from './hooks/useVendorInfo';
export { useCustomerUsage } from './hooks/useCustomerUsage';
export { usePaymentMethodInfo } from './hooks/usePaymentMethodInfo';
export { useCustomerLink } from './hooks/useCustomerLink';
export { useSelfServeSettings } from './hooks/useSelfServeSettings';
export { useSelfServeCustomization } from './hooks/useSelfServeCustomization';
export { useMeters } from './hooks/useCustomerMeters';
export { useUsage } from './hooks/useUsage';
export { useTotalAccruedRevenue } from './hooks/useTotalAccruedRevenue';
export { useSpendByTime } from './hooks/useSpendByTime';
export { useUsageByTime } from './hooks/useUsageByTime';
export { useCreditGrants } from './hooks/useCreditGrants';
export { useAvailableCreditBalance } from './hooks/useAvailableCreditBalance';
export { useCreditTopOffPlan } from './hooks/useCreditTopOffPlan';

export const Actions = {
  subscribeCustomer,
  getActiveSubscription,
  hasPaymentInfo,
  updateCustomerContactInfo,
  getAllPricePlans,
  getContactInfo,
  getInvoices,
  getPaymentMethodStatus,
  getVendorInfo,
  getCustomerUsage,
  getPaymentMethodInfo,
  getLinkToCustomerPage,
  getSelfServeSettings,
  getSelfServeCustomization,
  getCustomerMeters,
  getCustomerTotalAccruedRevenue,
  getCustomerSpendByTime,
  getCustomerUsageByTime,
  getCustomerCreditGrants,
  getCustomerAvailableCreditBalance,
  getCustomerCreditTopOffPlan,
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
export { EmbeddedPortal } from './components/EmbeddedPortal';

// Token provider
export { TokenProvider, useCustomerToken } from './hooks/useCustomerToken';

// Types
export type SchemaTypes = components['schemas'];
