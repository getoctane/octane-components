import { components } from '../apiTypes';
import { API_BASE } from '../config';

type Schemas = components['schemas'];

type ContactInfo = Schemas['ContactInfo'];
type ContactInfoInputArgs = Schemas['ContactInfoInputArgs'];
type Invoice = Schemas['CustomerPortalInvoice'];
type PricePlan = Schemas['PricePlan'];
type ActiveSubscription = Schemas['CustomerPortalActiveSubscription'];
type ActivePricePlan = Schemas['CustomerPortalSubscription'];
type CustomerPortalStripeCredential = Schemas['CustomerPortalStripeCredential'];
type CustomerPaymentMethodStatus = Schemas['CustomerPaymentMethodStatus'];
type VendorInfo = Schemas['CustomerPortalVendor'];
type CustomerPortalUsage = Schemas['CustomerPortalUsage'];
type CustomerPortalMeterLabelFilter = Schemas['CustomerPortalMeterLabelFilter'];
type CustomerPortalPaymentInfo = Schemas['CustomerPortalPaymentMethod'];
type CustomerPortalUrl = Schemas['CustomerPortalUrl'];
type SelfServeSettings = Schemas['SelfServeSettings'];
type SelfServeCustomization = Schemas['SelfServeCustomization'];
type ActiveSubscriptionInputArgs =
  Schemas['CustomerPortalActiveSubscriptionInputArgs'];
type CustomerPortalMeter = Schemas['CustomerPortalMeter'];

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
type UrlFactory<PathArgs extends unknown[] = []> = (
  base?: string | undefined,
  ...pathArgs: PathArgs
) => string;

/**
 * A config object to let us customize how we make GET requests.
 * Since this config should be optional, all of its keys should also be optional.
 */
export type ApiGETConfig<QueryParams> = {
  token: string;
  urlOverride?: string;
  params?: QueryParams;
};

/**
 * A config object to let us customize how we make GET requests.
 * Since this config should be optional, all of its keys should also be optional.
 */
type ApiPOSTConfig<BodyType> = {
  token: string;
  urlOverride?: string;
  body?: BodyType;
};

/**
 * A Fetch response that is successful, and has types for json()
 */
export interface TypedSuccessResponse<T> extends Response {
  ok: true;
  json(): Promise<T>;
}
/**
 * A Fetch response that is unsuccessful, and has types for json()
 */
export interface TypedFailureResponse<T = unknown> extends Response {
  ok: false;
  json(): Promise<T>;
}

export type TypedResponse<Success, Failure = unknown> =
  | TypedSuccessResponse<Success>
  | TypedFailureResponse<Failure>;

/* = = = = = = = = = = = = = =

  HELPER METHODS

 = = = = = = = = = = = = = = = */

/**
 * Given a token, create a RequestInit object to configure fetch() with
 */
const getFetchConfig = (
  token: string,
  { headers, ...rest }: RequestInit = {}
): RequestInit => ({
  headers: {
    Authorization: `Bearer ${token}`,
    ...headers,
  },
  ...rest,
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
    QueryParams extends Record<string, string>,
    PathArgs extends unknown[],
    Success,
    Failure
  >(
    urlFactory: UrlFactory<PathArgs>
  ) =>
  (
    config: ApiGETConfig<QueryParams>,
    ...pathArgs: PathArgs
  ): Promise<TypedResponse<Success, Failure>> => {
    const { token, urlOverride, params } = config;
    const url = new URL(urlFactory(urlOverride, ...pathArgs));
    if (params) {
      url.search = new URLSearchParams(params).toString();
    }
    return fetch(url.toString(), getFetchConfig(token));
  };

const makeApiNonGETEndpoint =
  <BodyType, PathArgs extends unknown[], Success, Failure>(
    urlFactory: UrlFactory<PathArgs>,
    method: 'POST' | 'PUT' | 'DELETE' = 'POST'
  ) =>
  (
    config: ApiPOSTConfig<BodyType>,
    ...pathArgs: PathArgs
  ): Promise<TypedResponse<Success, Failure>> => {
    const { token, urlOverride, body } = config;
    const url = new URL(urlFactory(urlOverride, ...pathArgs));
    return fetch(
      url.toString(),
      getFetchConfig(token, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    );
  };

/* = = = = = = = = = = = = = =

  API ENDPOINTS

 = = = = = = = = = = = = = = = */

export const getPricePlansUrl: UrlFactory = (base = API_BASE): string =>
  `${base}/ecp/price_plans/`;

/**
 * Gets all price plans that can be read using `token`.
 * The token can be either a vendor token or a customer token.
 */
export const getPricePlans = makeApiGETEndpoint<
  never, // No query params
  [], // No URL path args
  PricePlan[], // Returns a list of price plans
  unknown // Undefined failure type
>(getPricePlansUrl);

export const getCustomerActiveSubscriptionUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/active_subscription`;

/**
 * For a given customer, returns the customer's active subscription (or null
 * if there is none).
 */
export const getCustomerActiveSubscription = makeApiGETEndpoint<
  never, // No query params
  [], // No URL path args
  ActiveSubscription | null, // Optionally returns an ActiveSubscription
  unknown // Undefined failure type
>(getCustomerActiveSubscriptionUrl);

/**
 * Create/update a subscription to a price plan for a given customer.
 */
export const updateSubscription = makeApiNonGETEndpoint<
  ActiveSubscriptionInputArgs, // Body type
  [], // No URL path args
  ActivePricePlan, // Return an active subscription
  unknown // Undefined failure type
>(getCustomerActiveSubscriptionUrl, 'POST');

export const getCustomerInvoicesUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/invoices`;

/**
 * For a given customer, returns the all customer's invoices (or null
 * if there is none).
 */
export const getCustomerInvoices = makeApiGETEndpoint<
  never, // No query params
  [], // No URL path args
  Invoice[] | null, // Optionally returns Invoices
  unknown // Undefined failure type
>(getCustomerInvoicesUrl);

export const getVendorInfoUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/vendor`;

/**
 * For a given customer, returns it's vendor info or null
 * if there is none).
 */
export const getVendorInfo = makeApiGETEndpoint<
  never, // No query params
  [], // No URL path args
  VendorInfo | null, // Optionally returns Vendor's Info
  unknown // Undefined failure type
>(getVendorInfoUrl);

export const getContactInfoUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/contact_info`;

/**
 * For a given customer, returns the contact info or null
 * if there is none).
 */
export const getContactInfo = makeApiGETEndpoint<
  never, // No query params
  [], // No URL path args
  ContactInfo | null, // Optionally returns Contact Info
  unknown // Undefined failure type
>(getContactInfoUrl);

/**
 * For a given customer, allows to update contact info
 */
export const updateContactInfo = makeApiNonGETEndpoint<
  ContactInfoInputArgs, // body type
  [], // No URL path args
  ContactInfo, // Returns updated Contact info
  unknown // Undefined failure type
>(getContactInfoUrl, 'PUT');

export const createStripeSetupIntentUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/setup_intent`;

export const createStripeSetupIntent = makeApiNonGETEndpoint<
  never, // No body type
  [], // No URL path args
  CustomerPortalStripeCredential, // Returns Stripe credentials
  unknown // Undefined failure type
>(createStripeSetupIntentUrl);

export const getCustomerUsageUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/filtered_usage`;

export const getCustomerUsage = makeApiNonGETEndpoint<
  CustomerPortalMeterLabelFilter, // Body type
  [], // No URL path args
  CustomerPortalUsage, // Returns Stripe credentials
  unknown // Undefined failure type
>(getCustomerUsageUrl, 'POST');

// export const getCustomerUsage = makeApiGETEndpoint<
//   never, // No query params
//   [], // No URL path args
//   CustomerUsage[], // Returns customer's usage
//   unknown // Undefined failure type
// >(getCustomerUsageUrl);

export const getPaymentMethodStatusUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/payment_method_status`;

export const getPaymentMethodStatus = makeApiGETEndpoint<
  never, // No query params
  [], // No URL path args
  CustomerPaymentMethodStatus, // Returns Stripe payment method status
  unknown // Undefined failure type
>(getPaymentMethodStatusUrl);

export const VALID_PAYMENT_METHOD = 'VALID_PAYMENT_METHOD';

export const getPaymentMethodInfoUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/payment_method`;

export const getPaymentMethodInfo = makeApiGETEndpoint<
  never, // No query params
  [], // No URL path args
  CustomerPortalPaymentInfo, // Returns payment method info
  unknown // Undefined failure type
>(getPaymentMethodInfoUrl);

export const getCustomersLinkUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/portal_url`;

export const getCustomersLink = makeApiGETEndpoint<
  never, // No query params
  [], // No URL path args
  CustomerPortalUrl, // Returns a link to customer's page
  unknown // Undefined failure type
>(getCustomersLinkUrl);

export const getSelfServeSettingsUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/self_serve_settings`;

export const getSelfServeSettings = makeApiGETEndpoint<
  never, // No query params
  [], // No URL path args
  SelfServeSettings, // Returns the vendor's self-serve settings
  unknown // Undefined failure type
>(getSelfServeSettingsUrl);

export const getSelfServeCustomizationUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/self_serve_customization`;

export const getSelfServeCustomization = makeApiGETEndpoint<
  never, // No query params
  [], // No URL path args
  SelfServeCustomization, // Returns the vendor's self-serve settings
  unknown // Undefined failure type
>(getSelfServeCustomizationUrl);

export const getSelfServeMetersUrl: UrlFactory = (base = API_BASE) =>
  `${base}/ecp/meters`;

export const getCustomerMeters = makeApiGETEndpoint<
  never, // No query params
  [], // No URL path args
  CustomerPortalMeter[], // Returns the list of customer's meters
  unknown // Undefined failure type
>(getSelfServeMetersUrl);
