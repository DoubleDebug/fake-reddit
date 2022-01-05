import axios from 'axios';
import { PostModel } from '../../models/post';
import { POSTS_PER_PAGE, SERVER_URL } from '../constants';
import { displayNotif } from '../toast';
import { convertToPost } from './firebaseToDataModel';

/**
 * Retrieves posts from the server
 * OPTIONAL PARAMETERS:
 * - offset
 * - limit
 * - subreddit id
 */
export async function getPosts(
    offset: number = 0,
    limit: number = POSTS_PER_PAGE,
    subreddit?: string
): Promise<PostModel[]> {
    // parameters
    let params: any = {
        offset: offset,
        limit: limit,
    };
    if (subreddit) params.subreddit = subreddit;

    // request data from server
    const response = await axios.get(`${SERVER_URL}/feed`, {
        params: params,
    });
    if (response.data.success) {
        // convert to data model
        const posts: PostModel[] = [];
        response.data.data.forEach((doc: any) =>
            posts.push(convertToPost(doc))
        );
        return posts;
    } else {
        // handle server failure
        displayNotif('Failed to load posts.', 'error');
        console.log(response.data.message);
        return [];
    }
}
