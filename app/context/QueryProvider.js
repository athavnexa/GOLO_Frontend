"use client";

import { SWRConfig } from "swr";
import { apiClient } from "../lib/api/core";

/**
 * Global Query Cache Provider powered by SWR
 * Provides instant in-memory caching, request deduplication,
 * and stale-while-revalidate background sync.
 */
export default function QueryProvider({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher: (endpoint) => apiClient(endpoint),
        revalidateOnFocus: false, // Prevents aggressive refetching on window focus
        revalidateOnReconnect: true, // Auto-sync when internet reconnects
        dedupingInterval: 4000, // Deduplicate identical requests within 4 seconds
        keepPreviousData: true, // Smooth UI transitions without layout flicker
        errorRetryCount: 2,
        shouldRetryOnError: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}
