"use client";

import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { useState } from "react";

// Different stale times for different data types (in milliseconds)
const STALE_TIMES = {
  // Static data - rarely changes
  movieDetails: 1000 * 60 * 60 * 48, // 48 hours
  showDetails: 1000 * 60 * 60 * 48, // 48 hours
  credits: 1000 * 60 * 60 * 24, // 24 hours
  images: 1000 * 60 * 60 * 24, // 24 hours
  videos: 1000 * 60 * 60 * 24, // 24 hours
  collection: 1000 * 60 * 60 * 48, // 48 hours
  
  // Semi-static data - changes occasionally
  similar: 1000 * 60 * 60 * 12, // 12 hours
  recommended: 1000 * 60 * 60 * 12, // 12 hours
  
  // Dynamic data - changes more frequently
  trending: 1000 * 60 * 60 * 2, // 2 hours
  popular: 1000 * 60 * 60 * 4, // 4 hours
  nowPlaying: 1000 * 60 * 60 * 2, // 2 hours
  onTheAir: 1000 * 60 * 60 * 2, // 2 hours
  topRated: 1000 * 60 * 60 * 8, // 8 hours
  upcoming: 1000 * 60 * 60 * 8, // 8 hours
  watchProviders: 1000 * 60 * 60 * 24, // 24 hours
  genres: 1000 * 60 * 60 * 24 * 7, // 1 week
} as const;

// GC time should be longer than stale time to keep data in cache
const GC_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale-while-revalidate: show cached data immediately, refetch in background
            staleTime: STALE_TIMES.popular,
            gcTime: GC_TIME,
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            refetchOnReconnect: true, // Refetch when reconnecting (for fresh data)
            retry: 2, // Retry failed requests twice
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
        },
      })
  );

  const [persister] = useState(() =>
    createSyncStoragePersister({
      storage: typeof window !== "undefined" ? window.localStorage : null,
      key: "rhevia-query-cache",
      // Compress cache to save space in localStorage
      serialize: (data) => JSON.stringify(data),
      deserialize: (data) => JSON.parse(data),
      // Only persist queries that are not search queries
      retry: ({ persistedClient }) => {
        // If cache fails to restore, start fresh
        console.warn("Failed to restore query cache, starting fresh");
        return persistedClient;
      },
    })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        buster: "v1",
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

// Export stale times for use in individual queries
export { STALE_TIMES };