import axios from 'axios';
import { User } from 'firebase/auth';
import { SERVER_ENDPOINTS } from '../misc/constants';

export async function submitPost(
  user: User | null | undefined,
  data: any,
): Promise<ResponseStatus> {
  if (!user) {
    return {
      success: false,
      message: 'User authentication failed.',
    };
  }

  const idToken = await user.getIdToken();
  const res = await axios.post(SERVER_ENDPOINTS.POST_SUBMIT_POST, data, {
    headers: {
      Authorization: idToken,
    },
  });
  return res.data;
}
