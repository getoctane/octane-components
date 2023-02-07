import { useCallback } from 'react';
import { useAsync } from './useAsync';
import type { UseAsyncReturnType } from './useAsync';
import fetchSelfServeSettings from '../actions/getSelfServeSettings';
import { components } from 'apiTypes';

type SelfServeSettings = components['schemas']['SelfServeSettings'];
export type UseSelfServeSettingsReturnType =
  UseAsyncReturnType<SelfServeSettings>;

/**
 * A hook that fetches the vendor's self-serve settings.
 */
export const useSelfServeSettings = (args: {
  token: string;
  baseApiUrl?: string;
}): UseSelfServeSettingsReturnType => {
  const { token, baseApiUrl } = args;

  if (!token) {
    throw new Error("Customer's token must be provided.");
  }

  const asyncFunc = useCallback(() => {
    return fetchSelfServeSettings(token, { baseApiUrl });
  }, [token, baseApiUrl]);

  return useAsync(asyncFunc);
};
