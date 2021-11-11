import { components } from 'apiTypes';

const PROD_API = 'https://api.cloud.getoctane.io';
type UrlFactory = (base?: string) => string;

/**
 * A config object to let us customize how we make requests.
 * Since this config should be optional, all of its keys should also be optional.
 */
interface ApiConfig {
  urlOverride?: string;
}

type PricePlan = components['schemas']['PricePlan'];

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

/**
 * given a token, create a RequestInit object to configure fetch() with
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
  <Success, Failure = unknown>(urlFactory: UrlFactory) =>
  (
    token: string,
    { urlOverride }: ApiConfig = {}
  ): Promise<TypedResponse<Success, Failure>> =>
    fetch(urlFactory(urlOverride), getFetchConfig(token));

export const getPricePlansUrl: UrlFactory = (base = PROD_API): string =>
  `${base}/price_plans/`;

/**
 * Gets all price plans that can be read using `token`.
 * The token can be either a vendor token or a customer token.
 */
export const fetchPricePlans =
  makeApiGETEndpoint<PricePlan[]>(getPricePlansUrl);
