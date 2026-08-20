'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Provider as ReduxProvider } from 'react-redux';
import { useState, type ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import { makeStore } from '@/store';
import { ReduxPersistence } from '@/store/persistence';

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false },
        },
      }),
  );

  // One store instance per browser session (created lazily, client-side).
  const [store] = useState(makeStore);

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={client}>
        <NuqsAdapter>
          <ThemeProvider>
            <AuthProvider>
              <ReduxPersistence>{children}</ReduxPersistence>
            </AuthProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
