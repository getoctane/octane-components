// Based on https://usehooks.com/useAsync/
import { useState, useEffect, useCallback } from 'react';

export type UseAsyncReturnType<Result, Error = unknown> =
  | {
      loading: true;
      result: null;
      error: null;
    }
  | {
      loading: false;
      result: Result;
      error: null;
    }
  | {
      loading: false;
      result: null;
      error: Error;
    }
  | {
      loading: false;
      result: null;
      error: null;
    };

/**
 * Given a function that returns a promise, provide a hook that exposes the
 * promise's result, error, and loading state. This hook takes advantage of
 * discriminated TypeScript unions for its return type; if `loading` is true,
 * then `error` and `null` are necessarily `null`. If `loading` or `error` are
 * null
 */
export const useAsync = <Result, Error>(
  asyncFn: () => Promise<Result>
): UseAsyncReturnType<Result, Error> => {
  const [result, setResult] = useState<UseAsyncReturnType<Result, Error>>({
    loading: true,
    result: null,
    error: null,
  });

  useEffect(() => {
    asyncFn()
      .then((result) => {
        setResult({ result, error: null, loading: false });
      })
      .catch((error) => {
        setResult({ result: null, error, loading: false });
      });
  }, [asyncFn]);

  return result;
};

export type UseAsyncDelayedReturnType<Result, Error = unknown> = [
  () => void,
  UseAsyncReturnType<Result, Error>
];

export const useAsyncDelayed = <Args extends unknown[], Result, Error>(
  asyncFn: (...args: Args) => Promise<Result>
): UseAsyncDelayedReturnType<Result, Error> => {
  const [result, setResult] = useState<UseAsyncReturnType<Result, Error>>({
    loading: false,
    result: null,
    error: null,
  });

  const delayedFunc = useCallback(
    (...args: Args) => {
      setResult({ result: null, error: null, loading: true });

      asyncFn(...args)
        .then((result) => {
          setResult({ result, error: null, loading: false });
        })
        .catch((error) => {
          setResult({ result: null, error, loading: false });
        });
    },
    [asyncFn]
  );

  return [delayedFunc, result];
};

export const createApiHook = <Args extends unknown[], Result>(
  apiMethod: (...args: Args) => Promise<Result>
) => {
  return function useApiHook(...args: Args) {
    return useAsync(() => apiMethod(...args));
  };
};
