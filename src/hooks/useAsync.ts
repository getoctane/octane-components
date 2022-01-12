// Based on https://usehooks.com/useAsync/
import { useState, useEffect } from 'react';
import { getPaymentMethodStatus } from '../api/octane';

type UseAsyncReturnType<Result, Error> =
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
    };

/**
 * Given a function that returns a promise, provide a hook that exposes the
 * promise's result, error, and loading state. This hook takes advantage of
 * discriminated TypeScript unions for its return type; if `loading` is true,
 * then `error` and `null` are necessarily `null`. If `loading` or `error` are
 * null
 */
const useAsync = <Result, Error>(
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

  // Loading is false but result hasn't been set;
};

export default useAsync;

export const createApiHook = <Args extends unknown[], Result>(
  apiMethod: (...args: Args) => Promise<Result>
) => {
  return function useApiHook(...args: Args) {
    return useAsync(() => apiMethod(...args));
  };
};

export const usePaymentMethodStatus = createApiHook(getPaymentMethodStatus);
