import axios from 'axios';
import { User } from 'firebase/auth';
import { SERVER_URL } from '../misc/constants';

export async function deleteFile(
    user: User,
    storagePath: string
): Promise<ResponseStatus> {
    const idToken = await user.getIdToken();
    const res = await axios.delete(`${SERVER_URL}/deleteFile`, {
        headers: {
            Authorization: idToken,
        },
        params: {
            path: storagePath,
        },
    });
    return res.data;
}
