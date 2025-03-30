import axios from 'axios';
import { User } from 'firebase/auth';
import { SERVER_ENDPOINTS } from '../misc/constants';

export async function updateAccount(
  user: User | null | undefined,
  data: {
    email?: string;
    password?: string;
    displayName?: string;
    photoURL?: string;
  },
): Promise<ResponseStatusWithData> {
  if (!user)
    return {
      success: false,
      message: 'User authentication failed.',
    };

  const idToken = await user.getIdToken();
  const response = await axios.patch(
    SERVER_ENDPOINTS.PATCH_UPDATE_ACCOUNT,
    data,
    {
      headers: {
        Authorization: idToken,
      },
    },
  );
  return response.data;
}
