import { Inbox } from '../pages/inbox/Inbox';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/inbox/$roomId')({
  component: () => <InboxWithRoom />,
});

function InboxWithRoom() {
  const { roomId } = Route.useParams();
  return <Inbox roomId={roomId} />;
}
