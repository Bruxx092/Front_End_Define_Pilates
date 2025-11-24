// @ts-nocheck
import { useState, useCallback, useEffect } from "react";

export const useApi = (initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiFunction, onSuccess = null) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro na requisição";
      setError(errorMessage);
      console.error("API Error:", errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  return { data, loading, error, request, reset, setData };
};
