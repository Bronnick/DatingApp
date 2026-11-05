import { QueryClient } from '@tanstack/react-query'

// Same 5 minute cache as the Angular loading interceptor.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})
