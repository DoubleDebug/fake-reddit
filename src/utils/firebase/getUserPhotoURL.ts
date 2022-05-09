import axios from 'axios';
import { LS, SERVER_ENDPOINTS } from '../misc/constants';
import { getCachedData } from '../misc/manageLocalStorageData';

async function fetchUserPhotoURL(uid: string): Promise<string | null> {
    const res = await axios.get(
        `${SERVER_ENDPOINTS.GET_USER_PHOTO_URL}/${uid}`
    );
    if (res.data.success) return res.data.data;

    return null;
}

export async function getUserPhotoURL(
    uid: string
): Promise<string | undefined> {
    return getCachedData(
        LS.USER_PHOTO_URLS,
        uid,
        fetchUserPhotoURL,
        'uid',
        'url'
    );
}

export async function getUserPhotoURLData(
    uid: string
): Promise<{ uid: string; url: string | undefined }> {
    return { uid: uid, url: await getUserPhotoURL(uid) };
}
