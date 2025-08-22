"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { api } from '@/lib/trpc/client';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={api.createClient({ transformer: undefined })} queryClient={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </api.Provider>
    </QueryClientProvider>
  );
}