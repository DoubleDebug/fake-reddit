import axios from 'axios';
import { User } from 'firebase/auth';
import { SERVER_ENDPOINTS } from '../misc/constants';

export async function deleteAccount(
  user: User | null | undefined,
): Promise<ResponseStatus> {
  if (!user)
    return {
      success: false,
      message: 'User authentication failed.',
    };

  const idToken = await user.getIdToken();
  const response = await axios.delete(SERVER_ENDPOINTS.DELETE_ACCOUNT, {
    headers: {
      Authorization: idToken,
    },
  });
  return response.data;
}
