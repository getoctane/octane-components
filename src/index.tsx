import { components } from 'apiTypes';

// Top-level API components. These only need a customer token and should
// otherwise Just Work™.
export { PlanPicker } from 'components/PlanPicker';

// Helper components (must be wrapped with TokenProvider)
export { MeteredComponent } from 'components/MeteredComponent';
export { PricePlanCard } from 'components/PricePlanCard';
export { PaymentSubmission } from 'components/payment/PaymentSubmission';

// Token provider
export { TokenProvider } from 'hooks/useCustomerToken';

// Actions
export { default as subscribeCustomer } from 'actions/subscribeCustomer';

// Types
export type PricePlan = components['schemas']['PricePlan'];
export type MeteredComponent = components['schemas']['MeteredComponent'];
