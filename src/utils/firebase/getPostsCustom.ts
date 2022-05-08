import axios from 'axios';
import { User } from 'firebase/auth';
import { PostModel } from '../../models/post';
import { POSTS_PER_PAGE, SERVER_ENDPOINTS } from '../misc/constants';
import { displayNotif } from '../misc/toast';
import { convertToPost } from './firebaseToDataModel';

/**
 * Retrieves custom feed of posts from the server
 * REQUIRED PARAMETERS:
 * - user
 * OPTIONAL PARAMETERS:
 * - offset
 * - limit
 * - hideNSFW
 */
export async function getPostsCustom(
    user: User | null | undefined,
    offset: number = 0,
    limit: number = POSTS_PER_PAGE,
    hideNSFW?: boolean
): Promise<{
    posts: PostModel[];
    followedSubreddits: string[];
}> {
    if (!user) return { posts: [], followedSubreddits: [] };

    // parameters
    let params: any = {
        offset: offset,
        limit: limit,
    };
    if (hideNSFW) {
        params.hideNSFW = hideNSFW;
    }

    // request data from server
    const idToken = await user.getIdToken();
    const response = await axios
        .get(SERVER_ENDPOINTS.GET_POSTS_CUSTOM, {
            headers: {
                Authorization: idToken,
            },
            params: params,
        })
        .catch((error) => {
            // handle server failure
            displayNotif('Failed to load posts.', 'error');
            console.log(error);
        });
    if (!response) return { posts: [], followedSubreddits: [] };

    // convert to data model
    const posts: PostModel[] = [];
    response.data.data.posts.forEach((doc: any) =>
        posts.push(convertToPost(doc))
    );
    return {
        posts: posts,
        followedSubreddits: response.data.data.followedSubreddits,
    };
}
