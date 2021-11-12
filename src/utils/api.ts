import { components } from 'apiTypes';
type PricePlan = components['schemas']['PricePlan'];
type ActiveSubscription = components['schemas']['ActiveSubscription'];

const PROD_API = 'https://api.cloud.getoctane.io';

/* = = = = = = = = = = = = = = 

  HELPER TYPES

 = = = = = = = = = = = = = = = */

/**
 * This takes in an optional string base and some path args and spits out a URL.
 * It also encodes the URL's success and failure response types, as well as
 * any query params accepted by the URL.
 * I'd love to put `base` as the last param, but unfortunately TS only lets
 * ...rest params to be at the end of a list of args, not at the beginning.
 */
type UrlFactory<
  _QueryArgs extends Record<string, string> | undefined | void = void,
  PathArgs extends unknown[] = [],
  _Success = unknown,
  _Failure = unknown
> = (base?: string | undefined, ...args: PathArgs) => string;

/**
 * A config object to let us customize how we make requests.
 * Since this config should be optional, all of its keys should also be optional.
 */
type ApiConfig<QueryParams> = {
  token: string;
  urlOverride?: string;
  params?: QueryParams;
};

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
 */
const makeApiGETEndpoint =
  <
    QueryArgs extends Record<string, string> | undefined | void,
    PathArgs extends unknown[],
    Success,
    Failure
  >(
    urlFactory: UrlFactory<QueryArgs, PathArgs, Success, Failure>
  ) =>
  (
    { token, urlOverride, params }: ApiConfig<QueryArgs>,
    ...pathArgs: PathArgs
  ): Promise<TypedResponse<Success, Failure>> => {
    const url = new URL(urlFactory(urlOverride, ...pathArgs));
    if (params) {
      url.search = new URLSearchParams(params).toString();
    }
    return fetch(url.toString(), getFetchConfig(token));
  };

/* = = = = = = = = = = = = = = 

  API ENDPOINTS

 = = = = = = = = = = = = = = = */

export const getPricePlansUrl: UrlFactory<
  { tags?: string; names?: string },
  [],
  PricePlan[]
> = (base = PROD_API): string => `${base}/price_plans/`;

/**
 * Gets all price plans that can be read using `token`.
 * The token can be either a vendor token or a customer token.
 */
export const getPricePlans = makeApiGETEndpoint(getPricePlansUrl);

export const getCustomerActiveSubscriptionUrl: UrlFactory<
  never,
  [customer_name: string],
  ActiveSubscription | null
> = (base = PROD_API, customerName) =>
  `${base}/customers/${customerName}/active_subscription`;

/**
 * For a given customer, returns the customer's active subscription (or null
 * if there is none).
 */
export const getCustomerActiveSubscription = makeApiGETEndpoint(
  getCustomerActiveSubscriptionUrl
);
