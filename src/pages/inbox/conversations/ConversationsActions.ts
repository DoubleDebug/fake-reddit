import { User } from 'firebase/auth';
import { getUserPhotoURLData } from '../../../utils/firebase/getUserPhotoURL';
import { DEFAULT_PROFILE_URL } from '../../../utils/misc/constants';
import { shortenString } from '../../../utils/misc/shortenString';
import { getSecondUser } from '../../../utils/misc/whichUserUtils';

export function fetchPhotoURLs(
    user: User,
    rooms: IChatRoom[],
    setPhotoURLs: (u: { uid?: string; url?: string }[]) => void
) {
    const uids = rooms
        .map((r) => getSecondUser(user.uid, r.userIds))
        .filter((r) => r !== undefined);
    setPhotoURLs(uids.map((id) => ({ uid: id })));
    const promises: Promise<{ uid: string; url: string | undefined }>[] = [];
    uids.forEach((id) => {
        id && promises.push(getUserPhotoURLData(id));
    });

    Promise.all(promises).then((urls) => setPhotoURLs(urls));
}

export function findPhotoURL(
    photoURLs: { uid?: string; url?: string }[],
    uid: string | undefined
) {
    if (!uid) return DEFAULT_PROFILE_URL;
    const matches = photoURLs.filter((u) => u.uid === uid);
    if (matches[0]) return matches[0].url;
    else return DEFAULT_PROFILE_URL;
}

export function formatMessage(me: User | null | undefined, r: IChatRoom) {
    if (!me) return '';
    const length = 25;
    const lastMessage = r.messages[r.messages.length - 1];
    if (!lastMessage) return '';

    const isLastMessageMine = lastMessage.from.id === me.uid;

    return shortenString(
        (isLastMessageMine ? 'You: ' : '') + lastMessage.content,
        length
    );
}
