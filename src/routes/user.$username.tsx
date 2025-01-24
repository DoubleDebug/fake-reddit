import { createFileRoute } from '@tanstack/react-router';
import { Profile } from '../pages/profile/profile/Profile';

export const Route = createFileRoute('/user/$username')({
  component: () => <Profile />,
});
