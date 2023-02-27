import { getSelfServeCustomization } from '../api/octane';
import { components } from '../apiTypes';

type SelfServeCustomizaton = components['schemas']['SelfServeCustomization'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the vendor's self-serve customization.
 */
export default async function fetchSelfServeCustomization(
  customerToken: string,
  options: Options = {}
): Promise<SelfServeCustomizaton | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getSelfServeCustomization({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the vendor's self-serve customization"
    );
  }
  const data = await response.json();
  return data;
}
