import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import appRoute from './App';
import './index.css';
import MockServer from './MockServer';

if (import.meta.env.MODE === 'development') {
  // eslint-disable-next-line no-console
  console.log('Mocking server...');
  MockServer();
}

const router = createBrowserRouter([appRoute]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
