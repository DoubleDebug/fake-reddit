import { createFileRoute } from '@tanstack/react-router';
import { ResetPassword } from '../pages/login/resetPassword/ResetPassword';

export const Route = createFileRoute('/login/reset-password')({
  component: () => <ResetPassword />,
  validateSearch: (search: Record<string, unknown>) => {
    if (typeof search?.email === 'string') return { email: search.email };
    return {};
  },
});
