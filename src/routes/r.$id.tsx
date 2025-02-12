import { createFileRoute } from '@tanstack/react-router';
import { SubredditPage } from '../pages/subreddit/SubredditPage';

export const Route = createFileRoute('/r/$id')({
  component: () => <SubredditPage />,
});
