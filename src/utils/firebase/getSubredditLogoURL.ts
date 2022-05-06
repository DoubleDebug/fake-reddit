import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { LS } from '../misc/constants';
import { getCachedData } from '../misc/manageLocalStorageData';

async function fetchSubredditLogoURL(
    storagePath: string
): Promise<string | null> {
    const storage = getStorage();
    const pathReference = ref(storage, storagePath);
    const url = await getDownloadURL(pathReference).catch((error) => {
        console.log(
            'Failed to fetch subreddit logo from Firebas storage.',
            error
        );
    });
    return url || null;
}

export async function getSubredditLogoURL(
    storagePath: string
): Promise<string | undefined> {
    if (storagePath === '') return;
    return await getCachedData(
        LS.SUBREDDIT_LOGO_URLS,
        storagePath,
        fetchSubredditLogoURL,
        'path',
        'url'
    );
}
