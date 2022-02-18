import axios from 'axios';
import { SERVER_URL } from '../misc/constants';

export async function getUserPhotoURL(uid: string): Promise<string | null> {
    const res = await axios.get(`${SERVER_URL}/userPhotoURL/${uid}`);
    if (res.data.success) return res.data.photoURL;
    else return null;
}
