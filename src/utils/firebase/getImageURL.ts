import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { LS } from '../misc/constants';
import { log } from '../misc/log';

export async function fetchImageURL(storagePath: string): Promise<string> {
    return await getDownloadURL(ref(getStorage(), storagePath));
}

export async function getImageURL(storagePath: string): Promise<string> {
    try {
        // get cached url
        let map: any = localStorage.getItem(LS.CONTENT_URLS);
        if (!map) throw Error('No cached url map found.');
        map = JSON.parse(map);
        const record = map.filter((r: any) => r.path === storagePath);
        if (!record || !record[0] || !record[0].url)
            throw new Error('No record found in local storage.');

        return record[0].url;
    } catch {
        log(
            'Reading content URL from cache failed. Now fetching url from Firebase.'
        );

        // get url from Firebase
        const url = await getDownloadURL(ref(getStorage(), storagePath));
        if (url) {
            // persist url in local storage
            const previousRecords = localStorage.getItem(LS.CONTENT_URLS);
            const recordToAdd = {
                path: storagePath,
                url: url,
            };

            if (previousRecords) {
                const data = JSON.stringify([
                    ...JSON.parse(previousRecords).filter(
                        (r: any) => r.path !== storagePath // avoid duplicates
                    ),
                    recordToAdd,
                ]);
                localStorage.setItem(LS.CONTENT_URLS, data);
            } else {
                const data = JSON.stringify([recordToAdd]);
                localStorage.setItem(LS.CONTENT_URLS, data);
            }

            return url;
        }

        return 'ERROR';
    }
}
