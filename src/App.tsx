import { Outlet, RouteObject } from 'react-router-dom';
import NotFound from '@pages/NotFound';
import Home from '@pages/Home';

type AppProps = {
  children?: React.ReactNode;
};
function App({ children }: AppProps) {
  return (
    <>
      <header>header</header>
      {children}
      <footer>footer</footer>
    </>
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
    </App>
  ),
  children: [{ path: '', element: <Home /> }],
};

export default App;
