import axios from 'axios';
import { SERVER_ENDPOINTS } from '../misc/constants';

export async function getUserEmailByUsername(
  username: string,
): Promise<ResponseStatusWithData> {
  const response = await axios.get(
    SERVER_ENDPOINTS.GET_USER_EMAIL_BY_USERNAME,
    {
      params: {
        username: username,
      },
    },
  );
  return response.data;
}
