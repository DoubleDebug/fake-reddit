import './index.css';
import { FC } from 'react';

// ROUTING
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';

const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export const App: FC = () => {
  return <RouterProvider router={router} />;
};
