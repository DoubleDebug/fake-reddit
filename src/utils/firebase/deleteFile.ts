import axios from 'axios';
import { User } from 'firebase/auth';
import { SERVER_ENDPOINTS } from '../misc/constants';

export async function deleteFile(
  user: User | null | undefined,
  storagePath: string,
): Promise<ResponseStatus> {
  if (!user) {
    return {
      success: false,
      message: 'User authentication failed.',
    };
  }

  const idToken = await user.getIdToken();
  const res = await axios.delete(SERVER_ENDPOINTS.DELETE_FILE, {
    headers: {
      Authorization: idToken,
    },
    params: {
      path: storagePath,
    },
  });
  return res.data;
}
