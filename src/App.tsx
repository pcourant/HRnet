import { Outlet, RouteObject } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import NotFound from '@pages/NotFound';
import Home from '@pages/Home';
import EmployeeList from '@pages/EmployeeList';

type AppProps = {
  children?: React.ReactNode;
};

const queryClient = new QueryClient();

/**
 * App component
 * @component
 */
export function App({ children }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
App.defaultProps = {
  children: undefined,
};

const appRoute: RouteObject = {
  path: '/',
  element: (
    <App>
      <Outlet />
    </App>
  ),
  errorElement: (
    <App>
      <NotFound />
    </App>
  ),
  children: [
    { path: '', element: <Home /> },
    { path: 'employee-list', element: <EmployeeList /> },
  ],
};

export default appRoute;
