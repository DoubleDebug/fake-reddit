import axios from 'axios';
import { User } from 'firebase/auth';
import { ISubreddit } from '../../models/subreddit';
import { SERVER_ENDPOINTS } from '../misc/constants';

export async function submitSubreddit(
  user: User | null | undefined,
  data: ISubreddit,
): Promise<ResponseStatus> {
  if (!user) {
    return {
      success: false,
      message: 'User authentication failed.',
    };
  }

  const idToken = await user.getIdToken();
  const res = await axios.post(SERVER_ENDPOINTS.POST_SUBMIT_SUBREDDIT, data, {
    headers: {
      Authorization: idToken,
    },
  });
  return res.data;
}
