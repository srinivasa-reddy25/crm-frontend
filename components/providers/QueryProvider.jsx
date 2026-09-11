'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import queryClient from '@/lib/queryClient';

export function QueryProvider({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SHOW_DEVTOOLS === 'true' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
