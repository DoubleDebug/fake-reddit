import { NewPost } from '../pages/newPost/newPost';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/new-post')({
  component: () => <NewPost />,
});
