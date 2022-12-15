import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import type { ChildrenProps } from '@types';

/**
 * Wrapper to provide a BrowserRouter and a React-Query client provider
 */
function wrapperRouterAndQueryClient({ children }: ChildrenProps) {
  const queryClient = new QueryClient();
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
}

/**
 * Wrapper to provide a React-Query client provider
 */
function wrapperQueryClient({ children }: ChildrenProps) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export { wrapperRouterAndQueryClient, wrapperQueryClient };
