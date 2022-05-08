import axios from 'axios';
import { PostModel } from '../../models/post';
import { POSTS_PER_PAGE, SERVER_ENDPOINTS } from '../misc/constants';
import { displayNotif } from '../misc/toast';
import { convertToPost } from './firebaseToDataModel';

/**
 * Retrieves posts from the server
 * OPTIONAL PARAMETERS:
 * - offset
 * - limit
 * - subreddit id
 * - hideNSFW
 */
export async function getPosts(
    offset: number = 0,
    limit: number = POSTS_PER_PAGE,
    subreddit?: string,
    sortBy?: 'new' | 'top',
    hideNSFW?: boolean
): Promise<PostModel[]> {
    // parameters
    let params: any = {
        offset: offset,
        limit: limit,
    };
    if (subreddit) params.subreddit = subreddit;
    if (sortBy) params.sortBy = sortBy;
    if (hideNSFW) params.hideNSFW = hideNSFW;

    // request data from server
    const response = await axios
        .get(SERVER_ENDPOINTS.GET_POSTS, {
            params: params,
        })
        .catch((error) => {
            // handle server failure
            displayNotif('Failed to load posts.', 'error');
            console.log(error);
        });

    // convert to data model
    const posts: PostModel[] = [];
    response &&
        response.data?.data?.forEach((doc: any) =>
            posts.push(convertToPost(doc))
        );
    return posts;
}
