import { useCallback, useEffect, useMemo, useState } from "react";

export interface UseFetchOptions<T> {
  /** When omitted, arrays use length===0; objects with `items` use items.length===0. */
  isEmpty?: (data: T | undefined) => boolean;
}

export interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
  /** True after a successful load when the payload is intentionally empty (not an error). */
  isEmpty: boolean;
  refetch: () => void;
}

function defaultIsEmpty<T>(data: T | undefined): boolean {
  if (data === undefined || data === null) return false;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    if ("items" in o && Array.isArray(o.items)) return o.items.length === 0;
  }
  return false;
}

/**
 * Runs an async factory when `deps` change. Surfaces loading, error, empty, and data distinctly.
 */
export function useFetch<T>(
  factory: () => Promise<T>,
  deps: unknown[],
  options?: UseFetchOptions<T>
): AsyncState<T> {
  const isEmptyFn = options?.isEmpty ?? defaultIsEmpty<T>;

  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => {
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(undefined);

    (async () => {
      try {
        const result = await factory();
        if (!cancelled) {
          setData(result);
          setError(undefined);
        }
      } catch (e) {
        if (!cancelled) {
          setData(undefined);
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- factory is caller-supplied; deps drive invalidation
  }, [...deps, tick]);

  const isEmpty = useMemo(
    () => !loading && !error && isEmptyFn(data),
    [loading, error, data, isEmptyFn]
  );

  return { data, loading, error, isEmpty, refetch };
}
