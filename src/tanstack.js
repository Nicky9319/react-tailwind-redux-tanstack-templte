import { QueryClient, QueryClientProvider, persistQueryClient } from '@tanstack/react-query';
import { persistWithLocalStorage } from '@tanstack/react-query-persist-client';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

persistQueryClient({
  queryClient,
  persister: persistWithLocalStorage(),
});

export function TanstackProvider({ children }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
