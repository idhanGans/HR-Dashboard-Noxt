import { QueryClient } from "@tanstack/react-query";

/**
 * Global QueryClient configuration
 * Following TanStack Query best practices for caching and error handling
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data considered fresh for 5 minutes
      staleTime: 1000 * 60 * 5,
      // Cache kept for 10 minutes after becoming unused
      gcTime: 1000 * 60 * 10,
      // Retry failed requests once
      retry: 1,
      // Don't refetch on window focus for this admin dashboard
      refetchOnWindowFocus: false,
      // Refetch when reconnecting to network
      refetchOnReconnect: true,
    },
    mutations: {
      // Don't retry mutations by default
      retry: false,
    },
  },
});
