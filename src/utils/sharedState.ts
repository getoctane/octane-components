/**
 * This module makes it easy to set and get shared, global state across a flow
 * in a type-safe way. Why would we want to do that? Great question.
 *
 * Say you want to implement a sign-up flow, and you want to render the PlanPicker
 * and the BillingInfo component separately as part of that. The two need to
 * share information with each other so that, when we're ready to create a
 * subscription, we know what price plan to make that subscription for and we
 * know that the customer has submitted their billing info already.
 *
 * If you're rendering these two components separately from each other, you'd
 * have to
 * 1. add listeners to both components to see when their internal state has
 *    changed (like what plan was selected), and keep track of that state.
 * 2. take that state and use it to call the createSubscription API
 *
 * That's no fun because it means you need to keep track of state that you
 * shouldn't have to think about.
 *
 * This module handles exactly that state. Our components all modify global
 * state using the methods defined here, and our actions make use of that state
 * when you're ready to call them (to, say, subscribe a customer).
 */

import { components } from 'apiTypes';
type PricePlan = components['schemas']['PricePlan'];
type ActiveSubscription = components['schemas']['CustomerPortalSubscription'];

interface WindowWithOcStorage extends Window {
  _OC_STORAGE_DONT_YOU_THINK_ABOUT_IT?: Record<string, string>;
}

const w: WindowWithOcStorage = window;
/**
 * LocalStorage or global value keys are prefixed with this constant to avoid
 * collisions with other scripts using localStorage.
 */
export const KEY_PREFIX = 'octane/';

/**
 * Determines whether or not localStorage is available. Detection happens at
 * module initialization time and is cached to ensure that all set/get calls
 * have consistent understanding about where to store data.
 */
const supportsLocalStorage = (): boolean =>
  (() => {
    const x = 'hello';
    try {
      // If we have localStorage, great! let's use it.
      localStorage.setItem(x, x);
      localStorage.removeItem(x);
      return true;
    } catch (e) {
      // Otherwise, let's use this global :(
      w._OC_STORAGE_DONT_YOU_THINK_ABOUT_IT =
        w._OC_STORAGE_DONT_YOU_THINK_ABOUT_IT || {};
      return false;
    }
  })();

/**
 * Stores a value under a given key. The value must be serializable (we pass
 * it to JSON.stringify() before storing it).
 *
 * Storage is backed by localStorage when available, and a global when not.
 * If neither are (somehow) available, this function throws.
 * If val is not JSON-serializable, this function also throws.
 */
function set<T>(key: string, val: T): void {
  const prefixedKey = `${KEY_PREFIX}${key}`;
  const valStr = JSON.stringify(val);
  if (supportsLocalStorage()) {
    localStorage.setItem(prefixedKey, valStr);
  } else if (w._OC_STORAGE_DONT_YOU_THINK_ABOUT_IT) {
    w._OC_STORAGE_DONT_YOU_THINK_ABOUT_IT[prefixedKey] = valStr;
  } else {
    throw new Error('Unable to store Octane global value.');
  }
}

/**
 * Given a key and a generic T for the type of the value stored at that key,
 * returned a deserialized value form the store. If the value is missing or
 * cannot be retrieved, this function returns `null`.
 *
 * Storage is backed by localStorage when available, and a global when not.
 * If val is not JSON-serializable, this function also throws.
 */
function get<T>(key: string): T | null {
  const prefixedKey = `${KEY_PREFIX}${key}`;
  let val: string | null | undefined = null;

  if (supportsLocalStorage()) {
    val = localStorage.getItem(prefixedKey);
  } else if (w._OC_STORAGE_DONT_YOU_THINK_ABOUT_IT) {
    val = w._OC_STORAGE_DONT_YOU_THINK_ABOUT_IT[prefixedKey];
  } else {
    return null;
  }

  if (val === undefined || val === null) {
    return null;
  }

  return JSON.parse(val);
}

function clear(key: string): void {
  const prefixedKey = `${KEY_PREFIX}${key}`;
  if (supportsLocalStorage()) {
    localStorage.removeItem(prefixedKey);
  } else if (w._OC_STORAGE_DONT_YOU_THINK_ABOUT_IT) {
    delete w._OC_STORAGE_DONT_YOU_THINK_ABOUT_IT[prefixedKey];
  }
}

interface StorageInterface<T> {
  get(): T | null;
  set(val: T): void;
  clear(): void;
}

/**
 * Given a key and a type, create a getter / setter function tuple bound to that
 * key that is only able to get / set values of the given type.
 */
function createStorage<T>(key: string): StorageInterface<T> {
  const storage: StorageInterface<T> = {
    get: () => get<T>(key),
    set: (val: T) => set<T>(key, val),
    clear: () => clear(key),
  };
  return storage;
}

/* = = = = = = = = = = = = = = 

  SETTERS / GETTERS
  These methods set and get specific pieces of data.
  They are encapsulated here to codify the way we store which data, and to make
  sure typing is consistent between setting and getting.

 = = = = = = = = = = = = = = = */

/**
 * Stores the price plan selected in the PricePlan picker. This is useful for
 * multi-step signup flows where you'd like to pick a plan, collect payment
 * information, and _then_ create a subscription for a customer once their
 * payment information is stored.
 *
 * Returns null if no price plan has been selected.
 */
export const selectedPricePlan = createStorage<PricePlan | null>(
  'selectedPricePlan'
);

/**
 * Store the customer's existing price plan. Useful for knowing if the user is
 * updating or creating a subscription. `'no_existing_plan'` indicates that the
 * customer has no current price plan. `null` indicates that this value hasn't
 * yet been populated.
 */
export const existingSubscription = createStorage<
  ActiveSubscription | 'no_existing_plan'
>('existingPricePlan');

/**
 * Store an indication that the customer has submitted billing info
 */
export const billingInfoProvided = createStorage<boolean>(
  'billingInfoProvided'
);
