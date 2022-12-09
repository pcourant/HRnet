import { Outlet, RouteObject } from 'react-router-dom';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import NotFound from '@pages/NotFound';
import Home from '@pages/Home/Home';
import EmployeeList from '@pages/EmployeeList/EmployeeList';

type AppProps = {
  children?: React.ReactNode;
};

const queryClient = new QueryClient();
function App({ children }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        {/* <header>header</header> */}
        {children}
        {/* <footer>footer</footer> */}
      </StyledEngineProvider>
    </QueryClientProvider>
  );
}
App.defaultProps = {
  children: undefined,
};

export const appRoute: RouteObject = {
  path: '/',
  element: (
    <App>
      <Outlet />
    </App>
  ),
  errorElement: (
    <App>
      <NotFound />
      employee-list
    </App>
  ),
  children: [
    { path: '', element: <Home /> },
    { path: 'employee-list', element: <EmployeeList /> },
  ],
};

export default App;
