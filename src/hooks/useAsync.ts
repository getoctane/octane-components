// Based on https://usehooks.com/useAsync/
import { useState, useEffect, useCallback } from 'react';

export type UseAsyncFetchAndUpdateReturnType<
  Result,
  FetchArgs extends unknown[] = [],
  UpdateArgs extends unknown[] = [],
  Error = unknown
> =
  | {
      loading: true;
      result: null;
      error: null;
      refetch: (...args: FetchArgs | []) => void;
      update: (...args: UpdateArgs) => Promise<Result>;
    }
  | {
      loading: boolean;
      result: Result;
      error: null;
      refetch: (...args: FetchArgs | []) => void;
      update: (...args: UpdateArgs) => Promise<Result>;
    }
  | {
      loading: boolean;
      result: null;
      error: Error;
      refetch: (...args: FetchArgs | []) => void;
      update: (...args: UpdateArgs) => Promise<Result>;
    };

export type UseAsyncFetchReturnType<
  Result,
  FetchArgs extends unknown[] = [],
  Error = unknown
> = Omit<
  UseAsyncFetchAndUpdateReturnType<Result, FetchArgs, [], Error>,
  'update'
>;

/**
 * Given a function that returns a promise, provide a hook that exposes the
 * promise's result, error, loading state, refetch function and optional function to update data.
 * This hook takes advantage of discriminated TypeScript unions for its return type; only one of `result`
 * and `error` can be set at a time.
 */
export function useAsync<Result, Error>(args: {
  fetchFn: () => Promise<Result | null>;
}): UseAsyncFetchReturnType<Result, [], Error>;
export function useAsync<Result, UpdateArgs extends unknown[], Error>(args: {
  fetchFn: () => Promise<Result | null>;
  updateFn: (...args: UpdateArgs) => Promise<Result>;
}): UseAsyncFetchAndUpdateReturnType<Result, [], UpdateArgs, Error>;
export function useAsync<Result, FetchArgs extends unknown[], Error>(args: {
  fetchFn: (...args: FetchArgs) => Promise<Result | null>;
  initialArgs: FetchArgs;
}): UseAsyncFetchReturnType<Result, FetchArgs, Error>;
export function useAsync<
  Result,
  FetchArgs extends unknown[],
  UpdateArgs extends unknown[],
  Error
>(args: {
  fetchFn: (...args: FetchArgs) => Promise<Result | null>;
  initialArgs: FetchArgs;
  updateFn: (...args: UpdateArgs) => Promise<Result>;
}): UseAsyncFetchAndUpdateReturnType<Result, FetchArgs, UpdateArgs, Error>;

export function useAsync<
  Result,
  FetchArgs extends unknown[],
  UpdateArgs extends unknown[],
  Error
>(args: {
  fetchFn: (...args: FetchArgs | []) => Promise<Result | null>;
  initialArgs?: FetchArgs;
  updateFn?: (...args: UpdateArgs) => Promise<Result>;
}):
  | UseAsyncFetchReturnType<Result, FetchArgs, Error>
  | UseAsyncFetchAndUpdateReturnType<Result, FetchArgs, UpdateArgs, Error> {
  const { fetchFn, initialArgs, updateFn } = args;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(
    (...args: FetchArgs | []) => {
      setLoading(true);
      fetchFn(...args)
        .then((fetchResult) => {
          setResult(fetchResult);
          setError(null);
        })
        .catch((error) => {
          setResult(null);
          setError(error);
        })
        .finally(() => setLoading(false));
    },
    [fetchFn]
  );

  useEffect(() => {
    if (!initialArgs) {
      refetch();
    } else {
      refetch(...initialArgs);
    }
  }, [initialArgs, refetch]);

  return updateFn == null
    ? {
        loading,
        result,
        error,
        refetch,
      }
    : {
        loading,
        result,
        error,
        refetch,
        update: (...args: UpdateArgs) =>
          updateFn(...args).then((updateResult) => {
            setResult(updateResult);
            setError(null);
            setLoading(false);
            return updateResult;
          }),
      };
}

export const createApiHook = <FetchArgs extends unknown[], Result>(
  apiMethod: (...args: FetchArgs) => Promise<Result>
) => {
  return function useApiHook(...args: FetchArgs) {
    return useAsync({ fetchFn: () => apiMethod(...args) });
  };
};
