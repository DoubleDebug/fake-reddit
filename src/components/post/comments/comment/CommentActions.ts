import { User } from 'firebase/auth';
import { deleteComment as delComment } from '../../../../utils/firebase/deleteComment';

export function deleteComment(
  user: User | undefined | null,
  commentId: string | undefined,
) {
  if (!commentId) return;
  delComment(user, commentId);
}
