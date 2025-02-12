import { RootPage } from '../pages/Root';
import { createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => <RootPage />,
});
