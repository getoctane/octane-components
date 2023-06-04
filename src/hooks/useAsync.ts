// Based on https://usehooks.com/useAsync/
import { useState, useEffect } from 'react';

export type UseAsyncReturnType<Result, Error = unknown> =
  | {
      loading: true;
      result: null;
      error: null;
    }
  | {
      loading: boolean;
      result: Result;
      error: null;
    }
  | {
      loading: boolean;
      result: null;
      error: Error;
    };

/**
 * Given a function that returns a promise, provide a hook that exposes the
 * promise's result, error, and loading state. This hook takes advantage of
 * discriminated TypeScript unions for its return type; only one of `result`
 * and `error` can be set at a time.
 */
export function useAsync<Result, Error>(
  asyncFn: () => Promise<Result>
): UseAsyncReturnType<Result, Error>;
export function useAsync<Result, Args extends unknown[], Error>(
  asyncFn: (...args: Args) => Promise<Result>,
  initialArgs: Args
): UseAsyncReturnType<Result, Error>;

export function useAsync<Result, Args extends unknown[], Error>(
  asyncFn: (...args: Args | []) => Promise<Result>,
  initialArgs?: Args
): UseAsyncReturnType<Result, Error> {
  const [result, setResult] = useState<UseAsyncReturnType<Result, Error>>({
    loading: true,
    result: null,
    error: null,
  });

  useEffect(() => {
    setResult({ ...result, loading: true });
    if (!initialArgs) {
      asyncFn()
        .then((result) => {
          setResult({ result, error: null, loading: false });
        })
        .catch((error) => {
          setResult({ result: null, error, loading: false });
        });
    } else {
      asyncFn(...initialArgs)
        .then((result) => {
          setResult({ result, error: null, loading: false });
        })
        .catch((error) => {
          setResult({ result: null, error, loading: false });
        });
    }
  }, [asyncFn, initialArgs, result]);

  return result;
}

export const createApiHook = <Args extends unknown[], Result>(
  apiMethod: (...args: Args) => Promise<Result>
) => {
  return function useApiHook(...args: Args) {
    return useAsync(() => apiMethod(...args));
  };
};
