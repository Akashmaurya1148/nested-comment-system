import { useEffect, useRef, useState } from "react";

export function useAsync(asyncFn, deps = []) {
  const mounted = useRef(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!asyncFn) return;
      try {
        setLoading(true);
        setError(null);
        const result = await asyncFn();
        if (!cancelled && mounted.current) setValue(result);
      } catch (err) {
        if (!cancelled && mounted.current) setError(err);
      } finally {
        if (!cancelled && mounted.current) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };

  }, deps);

  return { loading, error, value };
}

export function useAsyncFn(asyncFn, deps = []) {
  const mounted = useRef(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const execute = async (...args) => {
    if (!asyncFn) return;
    let cancelled = false;
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFn(...args);
      if (!cancelled && mounted.current) {
        return result;
      }
    } catch (err) {
      if (!cancelled && mounted.current) {
        setError(err);
        throw err;
      }
    } finally {
      if (!cancelled && mounted.current) {
        setLoading(false);
      }
    }
  };

  return { loading, error, execute };
}