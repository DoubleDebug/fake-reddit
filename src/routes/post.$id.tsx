import { createFileRoute } from '@tanstack/react-router';
import { ViewPost } from '../pages/viewPost/viewPost';

export const Route = createFileRoute('/post/$id')({
  component: () => <ViewPost />,
});
