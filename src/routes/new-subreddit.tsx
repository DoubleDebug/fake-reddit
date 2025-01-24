import { createFileRoute } from '@tanstack/react-router'
import { NewSubreddit } from '../pages/newSubreddit/NewSubreddit'

export const Route = createFileRoute('/new-subreddit')({
  component: () => <NewSubreddit />,
})
