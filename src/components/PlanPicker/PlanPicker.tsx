import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { components } from 'apiTypes';
import { PricePlanCard } from 'components/PlanPicker/PricePlanCard';
import { getCustomerActiveSubscription, getPricePlans } from 'api/octane';
import { TokenProvider, useCustomerToken } from 'hooks/useCustomerToken';

export type PricePlan = components['schemas']['PricePlan'];
export type MeteredComponent = components['schemas']['MeteredComponent'];

type LoadingState =
  // Loading has started, but it's too soon to show a loading state
  | 'preload'
  // It's taken some time, show a loading state
  | 'loading'
  // The component has all the data it needs
  | 'loaded';

interface PricePlanManagerProps {
  /**
   * Callback triggered whenever a plan is selected.
   */
  onPlanSelect?: (planName: string, plan: PricePlan) => void;
}

export interface PlanPickerProps extends PricePlanManagerProps {
  /**
   * An API token with permissions for a specific customer.
   */
  customerToken: string;
}

function getIDForPricePlan(plan: PricePlan): string {
  return `${plan.name}--${plan.created_at}`;
}

function planEquals(plan1: PricePlan, plan2: PricePlan | null): boolean {
  if (plan2 === null) {
    return false;
  }
  return getIDForPricePlan(plan1) === getIDForPricePlan(plan2);
}

function PricePlanManager({
  onPlanSelect,
}: PricePlanManagerProps): JSX.Element {
  // The plans to pick from
  const [pricePlans, setPricePlans] = useState<PricePlan[]>([]);
  // The plan the customer is currently subscribed to, if any
  const [existingPlan, setExistingPlan] = useState<PricePlan | null>(null);
  // The plan the customer has selected in the UI
  const [selectedPlan, setSelectedPlan] = useState<PricePlan | null>(null);
  // Loading state indicator for the UI
  const [loading, setLoading] = useState<LoadingState>('preload');

  const { token } = useCustomerToken();

  const onSelectPlanName = useCallback(
    (planName: string, plan: PricePlan) => {
      // Update the local state
      setSelectedPlan(plan);
      // As well as the user-provided callback
      onPlanSelect && onPlanSelect(planName, plan);
    },
    [onPlanSelect]
  );

  useEffect(() => {
    // Clear any existing state (for example, if we're in storybook and
    // the customer token changes)
    setPricePlans([]);

    // Get all price plans
    const fetchPricePlans = async (): Promise<void> => {
      const result = await getPricePlans({ token });
      if (!result.ok) {
        throw new Error('Something went wrong fetching price plans');
      }
      const data = await result.json();
      setPricePlans(data);
    };

    // Get the current subscription, if one exists
    const fetchActiveSubscription = async (): Promise<void> => {
      const result = await getCustomerActiveSubscription({ token });
      if (!result.ok) {
        throw new Error('Something went wrong fetching price plans');
      }
      const data = await result.json();
      // Update component state
      if (data !== null && data.price_plan) {
        setExistingPlan(data.price_plan);
      }
    };

    setLoading('loading');

    Promise.all([fetchActiveSubscription(), fetchPricePlans()]).then(() => {
      setLoading('loaded');
    });
  }, [onSelectPlanName, setLoading, setPricePlans, setSelectedPlan, token]);

  return (
    <div className='octane-component price-plan-picker'>
      {loading === 'loading' && <div className='loading'>LOADING...</div>}
      {loading === 'loaded' &&
        pricePlans.map((plan) => (
          <PricePlanCard
            key={plan.name}
            pricePlan={plan}
            selected={planEquals(plan, selectedPlan)}
            existing={planEquals(plan, existingPlan)}
            onSelect={onSelectPlanName}
          />
        ))}
    </div>
  );
}
export function PlanPicker({
  customerToken: token,
  ...managerProps
}: PlanPickerProps): JSX.Element {
  return (
    <TokenProvider token={token}>
      <PricePlanManager {...managerProps} />
    </TokenProvider>
  );
}

PlanPicker.propTypes = {
  customerToken: PropTypes.string.isRequired,
};
