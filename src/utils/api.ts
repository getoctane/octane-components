import { components } from 'apiTypes';
type PricePlan = components['schemas']['PricePlan'];
type ActiveSubscription = components['schemas']['ActiveSubscription'];

const PROD_API = 'https://api.cloud.getoctane.io';

/* = = = = = = = = = = = = = = 

  HELPER TYPES

 = = = = = = = = = = = = = = = */

type UrlFactory<
  Args extends unknown[] = [],
  _Success = unknown,
  _Failure = unknown
> = (base?: string, ...args: Args) => string;

/**
 * A config object to let us customize how we make requests.
 * Since this config should be optional, all of its keys should also be optional.
 */
interface ApiConfig {
  token: string;
  urlOverride?: string;
}

/**
 * A Fetch response that is successful, and has types for json()
 */
interface TypedSuccessResponse<T> extends Response {
  ok: true;
  json(): Promise<T>;
}
/**
 * A Fetch response that is unsuccessful, and has types for json()
 */
interface TypedFailureResponse<T = unknown> extends Response {
  ok: false;
  json(): Promise<T>;
}

type TypedResponse<Success, Failure = unknown> =
  | TypedSuccessResponse<Success>
  | TypedFailureResponse<Failure>;

/* = = = = = = = = = = = = = = 

  HELPER METHODS

 = = = = = = = = = = = = = = = */

/**
 * Given a token, create a RequestInit object to configure fetch() with
 */
const getFetchConfig = (token: string): RequestInit => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/**
 * given a URL factory (something that takes in the base URL and spits out a
 * specific endpoint), generate a function that takes a token and calls that
 * endpoint.
 * Accepts a few generics:
 *  - Success is the type of the API when it's successful
 *  - Failure is the type of the API when it's... not. Defaults to unknown.
 * TODO: Also accept API params (whenever we need em)
 */
const makeApiGETEndpoint =
  <UrlFactoryArgs extends unknown[], Success, Failure>(
    urlFactory: UrlFactory<UrlFactoryArgs, Success, Failure>
  ) =>
  (
    { token, urlOverride }: ApiConfig,
    ...urlArgs: UrlFactoryArgs
  ): Promise<TypedResponse<Success, Failure>> =>
    fetch(urlFactory(urlOverride, ...urlArgs), getFetchConfig(token));

/* = = = = = = = = = = = = = = 

  API ENDPOINTS

 = = = = = = = = = = = = = = = */

export const getPricePlansUrl: UrlFactory<[], PricePlan[]> = (
  base = PROD_API
): string => `${base}/price_plans/`;

/**
 * Gets all price plans that can be read using `token`.
 * The token can be either a vendor token or a customer token.
 */
export const fetchPricePlans = makeApiGETEndpoint(getPricePlansUrl);

export const getCustomerActiveSubscriptionUrl: UrlFactory<
  [customer_name: string],
  ActiveSubscription | null
> = (base = PROD_API, customerName) =>
  `${base}/customers/${customerName}/active_subscription`;

/**
 * For a given customer, returns the customer's active subscription (or null
 * if there is none).
 */
export const fetchCustomerActiveSubscription = makeApiGETEndpoint(
  getCustomerActiveSubscriptionUrl
);
