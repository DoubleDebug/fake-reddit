import { NewPost } from '../pages/newPost/newPost';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/new-post')({
  component: () => <NewPost />,
  validateSearch: (search: Record<string, unknown>) => {
    if (typeof search?.r === 'string') return { r: search.r };
    return {};
  },
});
