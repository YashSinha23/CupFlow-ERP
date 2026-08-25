import { useState, useEffect, useCallback, useRef } from "react";

/**
 * @param {Function} fetchFn
 * @param {Array} deps
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearOnNextFetch = useRef(true);

  const runFetch = useCallback(async () => {
    if (clearOnNextFetch.current) {
      setData(null);
    }
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    clearOnNextFetch.current = true;
    runFetch();
  }, deps);

  const refetch = useCallback(() => {
    clearOnNextFetch.current = false;
    runFetch();
  }, [runFetch]);

  return { data, loading, error, refetch };
}