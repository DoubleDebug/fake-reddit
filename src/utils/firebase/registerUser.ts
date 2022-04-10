import axios from 'axios';
import { cleanObject } from '../misc/cleanObject';
import { SERVER_ENDPOINTS } from '../misc/constants';

export async function registerUserWithProvider(
    uid?: string,
    name?: string | null,
    photoURL?: string | null
): Promise<ResponseStatus> {
    const userData = cleanObject({
        id: uid,
        name: name,
        photoURL: photoURL,
    });
    const res = await axios.post(SERVER_ENDPOINTS.POST_REGISTER_USER, userData);
    return res.data;
}

export async function registerUserWithEmail(
    email: string,
    username: string,
    password: string
): Promise<ResponseStatus> {
    const res = await axios.post(SERVER_ENDPOINTS.POST_REGISTER_USER, {
        email: email,
        username: username,
        password: password,
    });
    return res.data;
}
