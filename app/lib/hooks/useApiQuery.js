"use client";

import useSWR from "swr";
import { useMemo } from "react";
import { apiClient } from "../api/core";

/**
 * Custom hook for cached API queries with SWR.
 * 
 * @param {string|Array|null} key - Cache key or endpoint path. Pass null to skip fetching.
 * @param {Function} [fetcher] - Custom fetcher function. Defaults to apiClient(endpoint).
 * @param {Object} [options] - Additional SWR options (e.g., revalidateOnFocus, dedupingInterval).
 * @returns {{ data: any, error: any, isLoading: boolean, isValidating: boolean, mutate: Function }}
 */
export function useApiQuery(key, fetcher, options = {}) {
  const resolvedFetcher = useMemo(() => {
    if (typeof fetcher === "function") {
      return fetcher;
    }
    // Default fetcher: if key is string endpoint, use apiClient
    return (endpoint) => apiClient(endpoint);
  }, [fetcher]);

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key,
    resolvedFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 4000,
      keepPreviousData: true,
      ...options,
    }
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

export default useApiQuery;
