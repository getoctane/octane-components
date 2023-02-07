import { getSelfServeSettings } from '../api/octane';
import { components } from '../apiTypes';

type SelfServeSettings = components['schemas']['SelfServeSettings'];

type Options = {
  baseApiUrl?: string;
};

/**
 * Fetches the vendor's self-serve settings.
 */
export default async function fetchSelfServeSettings(
  customerToken: string,
  options: Options = {}
): Promise<SelfServeSettings | null> {
  if (!customerToken) {
    throw new Error('Token must be provided.');
  }

  const response = await getSelfServeSettings({
    token: customerToken,
    urlOverride: options.baseApiUrl,
  });
  if (!response.ok) {
    throw new Error(
      "Something went wrong fetching the vendor's self-serve settings"
    );
  }
  const data = await response.json();
  return data;
}
