import axios from 'axios';
import { User } from 'firebase/auth';
import { SERVER_ENDPOINTS } from '../misc/constants';

export async function registerUser(
    user: User | null | undefined
): Promise<ResponseStatus> {
    if (!user) {
        return {
            success: false,
            message: 'User authentication failed.',
        };
    }

    const idToken = await user.getIdToken();
    const res = await axios.post(
        SERVER_ENDPOINTS.POST_REGISTER_USER,
        {
            id: user.uid,
            name: user.displayName,
            photoURL: user.photoURL,
        },
        {
            headers: {
                Authorization: idToken,
            },
        }
    );

    return res.data;
}
