import { LoginForm } from '../pages/login/LoginForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: () => <LoginForm tab="log in" />,
});
