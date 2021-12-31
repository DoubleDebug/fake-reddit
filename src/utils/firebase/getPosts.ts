import axios from 'axios';
import { PostModel } from '../../models/post';
import { POSTS_PER_PAGE, SERVER_URL } from '../constants';
import { convertToPost } from './firebaseToDataModel';

/**
 * Retrieves posts from the server
 * OPTIONAL PARAMETERS:
 * - offset
 * - limit
 */
export async function getPosts(
    offset: number = 0,
    limit: number = POSTS_PER_PAGE
): Promise<PostModel[]> {
    // request data from server
    const response = await axios.get(`${SERVER_URL}/posts`, {
        params: {
            offset: offset,
            limit: limit,
        },
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
        console.log(response.data.message);
        return [];
    }
}
