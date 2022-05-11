import { getAnalytics, logEvent } from 'firebase/analytics';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { ISubreddit } from '../../models/subreddit';
import { ANALYTICS_EVENTS, DB_COLLECTIONS } from '../../utils/misc/constants';
import { displayNotif } from '../../utils/misc/toast';

export async function followSubreddit(
    subreddit: Data<ISubreddit, '', ''> | undefined,
    uid: string,
    unfollow?: true
) {
    if (!subreddit) return;

    const updatedFollowers = unfollow
        ? subreddit.followers.filter((f) => f !== uid)
        : [...subreddit.followers, uid];

    const db = getFirestore();
    await updateDoc(doc(db, DB_COLLECTIONS.SUBREDDITS, subreddit.id), {
        ...subreddit,
        followers: updatedFollowers,
    }).catch((err) => {
        displayNotif('Failed to follow the subreddit.', 'error');
        console.log(err);
    });

    logEvent(getAnalytics(), ANALYTICS_EVENTS.FOLLOW_SUBREDDIT);
}
