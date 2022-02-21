import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { CommentModel } from '../../../models/comment';
import { getUserPhotoURL } from '../../../utils/firebase/getUserPhotoURL';
import { DB_COLLECTIONS, PROFILE_URL_MAP } from '../../../utils/misc/constants';

export function deleteComment(data: CommentModel) {
    if (!data.id) return;
    const db = getFirestore();
    deleteDoc(doc(db, DB_COLLECTIONS.COMMENTS, data.id));
}

export function getUsersPhotoURL(
    uid: string,
    setURLCallback: (u: string) => void
) {
    // get cached url
    try {
        let map: any = localStorage.getItem(PROFILE_URL_MAP);
        if (!map) throw Error('No cached url map found.');
        map = JSON.parse(map);
        const record = map.filter((r: any) => r.uid === uid);
        if (!record || !record[0] || !record[0].url)
            throw new Error('No record found in local storage.');
        setURLCallback(record[0].url);
    } catch {
        // get url from storage
        getUserPhotoURL(uid).then((url) => {
            if (url) setURLCallback(url);

            // persist url in local storage
            const prev = localStorage.getItem(PROFILE_URL_MAP);
            if (prev) {
                localStorage.setItem(
                    PROFILE_URL_MAP,
                    JSON.stringify([
                        ...JSON.parse(prev),
                        {
                            uid: uid,
                            url: url,
                        },
                    ])
                );
            } else {
                localStorage.setItem(
                    PROFILE_URL_MAP,
                    JSON.stringify([
                        {
                            uid: uid,
                            url: url,
                        },
                    ])
                );
            }
        });
    }
}
