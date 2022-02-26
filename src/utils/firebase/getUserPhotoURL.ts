import axios from 'axios';
import { LS_USER_PHOTO_URLS, SERVER_URL } from '../misc/constants';
import { log } from '../misc/log';

async function fetchUserPhotoURL(uid: string): Promise<string | null> {
    const res = await axios.get(`${SERVER_URL}/userPhotoURL/${uid}`);
    if (res.data.success) return res.data.photoURL;

    return null;
}

export async function getUserPhotoURL(uid: string): Promise<string | null> {
    try {
        // get cached url
        let map: any = localStorage.getItem(LS_USER_PHOTO_URLS);
        if (!map) throw Error('No cached url map found.');
        map = JSON.parse(map);
        const record = map.filter((r: any) => r.uid === uid);
        if (!record || !record[0] || !record[0].url)
            throw new Error('No record found in local storage.');

        return record[0].url;
    } catch {
        log(
            'Reading user photo URL from cache failed. Now fetching url from database.'
        );

        // get url from storage
        const url = await fetchUserPhotoURL(uid);
        if (url) {
            // persist url in local storage
            const previousRecords = localStorage.getItem(LS_USER_PHOTO_URLS);
            const recordToAdd = {
                uid: uid,
                url: url,
            };

            if (previousRecords) {
                const data = JSON.stringify([
                    ...JSON.parse(previousRecords).filter(
                        (r: any) => r.uid !== uid // avoid duplicates
                    ),
                    recordToAdd,
                ]);
                localStorage.setItem(LS_USER_PHOTO_URLS, data);
            } else {
                const data = JSON.stringify([recordToAdd]);
                localStorage.setItem(LS_USER_PHOTO_URLS, data);
            }

            return url;
        }

        return null;
    }
}
