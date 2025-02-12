import { LoginForm } from '../pages/login/LoginForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sign-up')({
  component: () => <LoginForm tab="sign up" />,
});
