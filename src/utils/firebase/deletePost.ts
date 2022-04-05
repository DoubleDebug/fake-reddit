import axios from 'axios';
import { User } from 'firebase/auth';
import { SERVER_ENDPOINTS } from '../misc/constants';

export async function deletePost(
    user: User | null | undefined,
    postId: string
) {
    if (!user) return;
    const idToken = await user.getIdToken();
    return await axios.delete(SERVER_ENDPOINTS.DELETE_POST, {
        headers: {
            Authorization: idToken,
        },
        params: {
            postId: postId,
        },
    });
}
