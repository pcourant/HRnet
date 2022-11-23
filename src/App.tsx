import { Outlet, RouteObject } from 'react-router-dom';
import StyledEngineProvider from '@mui/material/StyledEngineProvider';

import NotFound from '@pages/NotFound';
import Home from '@pages/Home/Home';
import EmployeeList from '@pages/EmployeeList/EmployeeList';

type AppProps = {
  children?: React.ReactNode;
};
function App({ children }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      {/* <header>header</header> */}
      {children}
      {/* <footer>footer</footer> */}
    </StyledEngineProvider>
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
