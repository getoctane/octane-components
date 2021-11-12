import { selectedPricePlan, existingSubscription } from 'utils/sharedState';

const mockPricePlan = { name: 'basic_plan', period: 'month' };
const mockSubscription = {
  customer_name: 'lowly_worm',
  price_plan_name: 'basic_plan',
};

describe('sharedState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('selectedPricePlan', () => {
    it('gets, sets, and clears price plans', () => {
      expect(selectedPricePlan.get()).toBeNull();
      selectedPricePlan.set(mockPricePlan);
      expect(selectedPricePlan.get()).toEqual(mockPricePlan);
      selectedPricePlan.clear();
      expect(selectedPricePlan.get()).toBeNull();
    });

    it('enforces input types', () => {
      // @ts-expect-error - Testing invalid types
      selectedPricePlan.set('not the right thing');
      // @ts-expect-error - Testing invalid types
      selectedPricePlan.set();
      // @ts-expect-error - Testing invalid types
      selectedPricePlan.set(mockSubscription);
      // Ah that's more like it
      selectedPricePlan.set(null);
    });
  });

  describe('existingSubscription', () => {
    it('gets, sets, and clears price plans', () => {
      expect(existingSubscription.get()).toBeNull();
      existingSubscription.set(mockSubscription);
      expect(existingSubscription.get()).toEqual(mockSubscription);
      existingSubscription.clear();
      expect(existingSubscription.get()).toBeNull();
    });

    it('enforces input types', () => {
      // @ts-expect-error - Testing invalid types
      existingSubscription.set('not the right thing');
      // @ts-expect-error - Testing invalid types
      existingSubscription.set(mockPricePlan);
      // Much better. Good job.
      existingSubscription.set('no_existing_plan');
    });
  });
});
