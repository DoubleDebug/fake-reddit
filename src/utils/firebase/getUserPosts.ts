import axios from 'axios';
import { PostModel } from '../../models/post';
import { POSTS_PER_PAGE, SERVER_ENDPOINTS } from '../misc/constants';
import { displayNotif } from '../misc/toast';
import { convertToPost } from './firebaseToDataModel';

/**
 * Retrieves posts from the server
 * REQUIRED PARAMETER:
 * - username
 * OPTIONAL PARAMETERS:
 * - offset
 * - limit
 */
export async function getUserPosts(
  username: string,
  offset: number = 0,
  limit: number = POSTS_PER_PAGE,
): Promise<PostModel[]> {
  // parameters
  const params: any = {
    username: username,
    offset: offset,
    limit: limit,
  };

  // request data from server
  const response = await axios
    .get(SERVER_ENDPOINTS.GET_USER_POSTS, {
      params: params,
    })
    .catch((error) => {
      // handle server failure
      displayNotif('Failed to load posts.', 'error');
      console.log(error);
    });

  if (!response) return [];
  if (!response.data?.success) {
    displayNotif(response.data.message, 'error');
    return [];
  }

  // convert to data model
  const posts: PostModel[] = [];
  response.data?.data?.forEach((doc: any) => posts.push(convertToPost(doc)));
  return posts;
}
