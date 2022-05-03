import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { LS } from '../misc/constants';
import { log } from '../misc/log';

async function fetchSubredditLogoURL(
    storagePath: string
): Promise<string | void> {
    const storage = getStorage();
    const pathReference = ref(storage, storagePath);
    return await getDownloadURL(pathReference).catch((error) => {
        console.log(
            'Failed to fetch subreddit logo from Firebas storage.',
            error
        );
    });
}

export async function getSubredditLogoURL(
    storagePath: string
): Promise<string | undefined> {
    if (storagePath === '') return;

    try {
        // get cached url
        let map: any = localStorage.getItem(LS.SUBREDDIT_LOGO_URLS);
        if (!map) throw Error('No cached url map found.');
        map = JSON.parse(map);
        const record = map.filter((r: any) => r.path === storagePath);
        if (!record || !record[0] || !record[0].url)
            throw new Error('No record found in local storage.');

        return record[0].url;
    } catch {
        log(
            'Reading subreddit logo URL from cache failed. Now fetching url from database.'
        );

        // get url from storage
        const url = await fetchSubredditLogoURL(storagePath);
        if (url) {
            // persist url in local storage
            const previousRecords = localStorage.getItem(
                LS.SUBREDDIT_LOGO_URLS
            );
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
                localStorage.setItem(LS.SUBREDDIT_LOGO_URLS, data);
            } else {
                const data = JSON.stringify([recordToAdd]);
                localStorage.setItem(LS.SUBREDDIT_LOGO_URLS, data);
            }

            return url;
        }

        return;
    }
}
