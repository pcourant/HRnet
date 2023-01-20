import { Outlet, RouteObject } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import loadable from '@loadable/component';

const NotFound = loadable(() => import('@pages/NotFound'));
const Home = loadable(() => import('@pages/Home'));
const EmployeeList = loadable(() => import('@pages/EmployeeList'));

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
  children: [
    {
      path: '',
      element: <Home />,
    },
    {
      path: 'employee-list',
      element: <EmployeeList />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default appRoute;
