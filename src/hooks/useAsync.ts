// Based on https://usehooks.com/useAsync/
import { useState, useEffect, useCallback } from 'react';

export type UseAsyncReturnType<
  Result,
  FetchArgs extends unknown[] = [],
  Error = unknown
> =
  | {
      loading: true;
      result: null;
      error: null;
      refetch: null;
    }
  | {
      loading: boolean;
      result: Result;
      error: null;
      refetch: (...args: FetchArgs | []) => void;
    }
  | {
      loading: boolean;
      result: null;
      error: Error;
      refetch: (...args: FetchArgs | []) => void;
    };

/**
 * Given a function that returns a promise, provide a hook that exposes the
 * promise's result, error, and loading state. This hook takes advantage of
 * discriminated TypeScript unions for its return type; only one of `result`
 * and `error` can be set at a time.
 */
export function useAsync<Result, Error>(
  fetchFn: () => Promise<Result>
): UseAsyncReturnType<Result, [], Error>;
export function useAsync<Result, FetchArgs extends unknown[], Error>(
  fetchFn: (...args: FetchArgs) => Promise<Result>,
  initialArgs: FetchArgs
): UseAsyncReturnType<Result, FetchArgs, Error>;

export function useAsync<Result, FetchArgs extends unknown[], Error>(
  fetchFn: (...args: FetchArgs | []) => Promise<Result>,
  initialArgs?: FetchArgs
): UseAsyncReturnType<Result, FetchArgs | [], Error> {
  const [result, setResult] = useState<
    UseAsyncReturnType<Result, FetchArgs, Error>
  >({
    loading: true,
    result: null,
    error: null,
    refetch: null,
  });

  const refetch = useCallback(
    (...args: FetchArgs | []) => {
      setResult({ ...result, loading: true });
      fetchFn(...args)
        .then((result) => {
          setResult({
            result,
            error: null,
            loading: false,
            refetch,
          });
        })
        .catch((error) => {
          setResult({
            result: null,
            error,
            loading: false,
            refetch,
          });
        });
    },
    [fetchFn, result]
  );

  useEffect(() => {
    if (!initialArgs) {
      refetch();
    } else {
      refetch(...initialArgs);
    }
  }, [initialArgs, refetch]);

  return result;
}

export const createApiHook = <FetchArgs extends unknown[], Result>(
  apiMethod: (...args: FetchArgs) => Promise<Result>
) => {
  return function useApiHook(...args: FetchArgs) {
    return useAsync(() => apiMethod(...args));
  };
};
