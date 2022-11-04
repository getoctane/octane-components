import { useState, useCallback } from 'react';

export type UseAsyncOnDemandResultType<Result, Error = unknown> =
  | {
      loading: true;
      result: null;
      error: null;
      status: 'IN_FLIGHT';
    }
  | {
      loading: false;
      result: Result;
      error: null;
      status: 'DONE';
    }
  | {
      loading: false;
      result: null;
      error: Error;
      status: 'DONE';
    }
  | {
      loading: false;
      result: null;
      error: null;
      status: 'UNSENT';
    };

export type UseAsyncOnDemandReturnType<Result, Error = unknown> = [
  () => void,
  UseAsyncOnDemandResultType<Result, Error>
];

export const useAsyncOnDemand = <Args extends unknown[], Result>(
  asyncFn: (...args: Args) => Promise<Result>
): UseAsyncOnDemandReturnType<Result, Error> => {
  const [result, setResult] = useState<
    UseAsyncOnDemandResultType<Result, Error>
  >({
    loading: false,
    result: null,
    error: null,
    status: 'UNSENT',
  });

  const funcOnDemand = useCallback(
    async (...args: Args) => {
      setResult({
        result: null,
        error: null,
        loading: true,
        status: 'IN_FLIGHT',
      });

      try {
        const result = await asyncFn(...args);
        setResult({
          result,
          error: null,
          loading: false,
          status: 'DONE',
        });
      } catch (error) {
        if (error instanceof Error) {
          setResult({
            result: null,
            error,
            loading: false,
            status: 'DONE',
          });
        }
      }
    },
    [asyncFn]
  );

  return [funcOnDemand, result];
};
