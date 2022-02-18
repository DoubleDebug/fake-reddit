import axios from 'axios';
import { User } from 'firebase/auth';
import { SERVER_URL } from '../misc/constants';

export async function deletePost(user: User, postId: string) {
    const idToken = await user.getIdToken();
    return await axios.delete(`${SERVER_URL}/deletePost`, {
        headers: {
            Authorization: idToken,
        },
        params: {
            postId: postId,
        },
    });
}
