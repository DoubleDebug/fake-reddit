import { createFileRoute } from '@tanstack/react-router';
import { EditProfile } from '../pages/profile/editProfile/EditProfile';

export const Route = createFileRoute('/profile/$username/edit')({
  component: () => <EditProfile />,
  validateSearch: (search: Record<string, unknown>) => {
    if (typeof search?.redirect === 'string')
      return { redirect: search.redirect };
    return {};
  },
});
