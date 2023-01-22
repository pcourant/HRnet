import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import appRoute from './App';
import './index.css';

if (import.meta.env.MODE === 'production')
  import('./MockServer').then((MockServer) => MockServer.default());
if (import.meta.env.MODE === 'development')
  import('./MockServer').then((MockServer) => MockServer.default());
if (import.meta.env.MODE === 'test')
  import('./MockServer').then((MockServer) => MockServer.default());

const router = createHashRouter([appRoute]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
