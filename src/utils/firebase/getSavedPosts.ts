import axios from 'axios';
import { User } from 'firebase/auth';
import { PostModel } from '../../models/post';
import { SERVER_ENDPOINTS } from '../misc/constants';
import { displayNotif } from '../misc/toast';
import { convertToPost } from './firebaseToDataModel';

/**
 * Retrieves user's saved post data from the server
 * REQUIRED PARAMETERS:
 * - user
 */
export async function getSavedPosts(
    user: User | null | undefined
): Promise<PostModel[]> {
    if (!user) return [];

    // request data from server
    const idToken = await user.getIdToken();
    const response = await axios
        .get(SERVER_ENDPOINTS.GET_SAVED_POSTS, {
            headers: {
                Authorization: idToken,
            },
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
