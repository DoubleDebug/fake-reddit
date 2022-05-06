import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { LS } from '../misc/constants';
import { getCachedData } from '../misc/manageLocalStorageData';

export async function fetchImageURL(storagePath: string): Promise<string> {
    return await getDownloadURL(ref(getStorage(), storagePath));
}

export async function getImageURL(storagePath: string): Promise<string> {
    const url = await getCachedData(
        LS.CONTENT_URLS,
        storagePath,
        fetchImageURL,
        'path',
        'url'
    );
    return url || 'ERROR';
}
