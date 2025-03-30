import axios from 'axios';
import { User } from 'firebase/auth';
import { SERVER_ENDPOINTS } from '../misc/constants';

export async function deleteComment(
  user: User | null | undefined,
  commentId: string,
) {
  if (!user) return;
  const idToken = await user.getIdToken();
  return await axios.delete(SERVER_ENDPOINTS.DELETE_COMMENT, {
    headers: {
      Authorization: idToken,
    },
    params: {
      id: commentId,
    },
  });
}
