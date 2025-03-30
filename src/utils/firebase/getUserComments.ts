import axios from 'axios';
import { CommentModel } from '../../models/comment';
import { POSTS_PER_PAGE, SERVER_ENDPOINTS } from '../misc/constants';
import { displayNotif } from '../misc/toast';
import { convertToComment } from './firebaseToDataModel';

/**
 * Retrieves posts from the server
 * REQUIRED PARAMETERS:
 * - username
 * OPTIONAL PARAMETERS:
 * - offset
 * - limit
 */
export async function getUserComments(
  username: string,
  offset: number = 0,
  limit: number = POSTS_PER_PAGE,
): Promise<CommentModel[]> {
  // parameters
  const params: any = {
    username: username,
    offset: offset,
    limit: limit,
  };

  // request data from server
  const response = await axios
    .get(SERVER_ENDPOINTS.GET_USER_COMMENTS, {
      params: params,
    })
    .catch((error) => {
      // handle server failure
      displayNotif('Failed to load comments.', 'error');
      console.log(error);
    });

  if (!response) return [];
  if (!response.data?.success) {
    displayNotif(response.data.message, 'error');
    return [];
  }

  // convert to data model
  const posts: CommentModel[] = [];
  response.data?.data?.forEach((doc: any) => posts.push(convertToComment(doc)));
  return posts;
}
