import { Home } from '../pages/home/Home';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: () => <Home />,
  validateSearch: (search: Record<string, unknown>) => {
    if (typeof search?.redirect === 'string')
      return { redirect: search.redirect };
    return {};
  },
});
