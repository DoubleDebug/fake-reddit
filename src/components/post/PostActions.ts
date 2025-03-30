import { User } from 'firebase/auth';
import { PostModel } from '../../models/post';
import { createChatRoom } from '../../pages/inbox/chat/ChatActions';
import { signInPopup } from '../../utils/signInPopup/SignInPopup';
import { displayNotif, displayNotifJSX } from '../../utils/misc/toast';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { ANALYTICS_EVENTS, DB_COLLECTIONS } from '../../utils/misc/constants';
import { removeDuplicates } from '../../utils/misc/removeDuplicates';
import { logEvent, getAnalytics } from 'firebase/analytics';

export function upvote(
  user: User | null | undefined,
  data: PostModel,
  upvoted: boolean | null,
  score: number,
  setUpvoted: (u: boolean | null) => void,
  setScore: (s: number) => void,
) {
  if (!user || !data.id) {
    displayNotifJSX(() => signInPopup('upvote a post'));
    return;
  }

  data.upvote(user.uid);

  if (upvoted === true) {
    setUpvoted(null);
    setScore(score - 1);
  } else if (upvoted === false) {
    setUpvoted(true);
    setScore(score + 2);
  } else {
    setUpvoted(true);
    setScore(score + 1);
  }

  logEvent(getAnalytics(), ANALYTICS_EVENTS.UPVOTE);
}

export function downvote(
  user: User | null | undefined,
  data: PostModel,
  upvoted: boolean | null,
  score: number,
  setUpvoted: (u: boolean | null) => void,
  setScore: (s: number) => void,
) {
  if (!user || !data.id) {
    displayNotifJSX(() => signInPopup('downvote a post'));
    return;
  }

  data.downvote(user.uid);

  if (upvoted === false) {
    setUpvoted(null);
    setScore(score + 1);
  } else if (upvoted === true) {
    setUpvoted(false);
    setScore(score - 2);
  } else {
    setUpvoted(false);
    setScore(score - 1);
  }

  logEvent(getAnalytics(), ANALYTICS_EVENTS.DOWNVOTE);
}

export function deletePost(
  user: User | null | undefined,
  data: PostModel,
  setIsDeleted: (d: boolean) => void,
) {
  if (!user || !data.id) return;
  return data.delete(user, data.subreddit, () => {
    setIsDeleted(true);
    logEvent(getAnalytics(), ANALYTICS_EVENTS.DELETE_POST);
  });
}

export async function openChatRoom(
  me: User | null | undefined,
  secondUser: {
    id: string;
    name: string;
  },
  setRedirectChatId: (id: string | null) => void,
) {
  if (!me) {
    displayNotifJSX(() => signInPopup(`chat with ${secondUser.name}`));
    return;
  }
  const room = await createChatRoom(
    {
      id: me.uid,
      name: me.displayName!,
    },
    {
      id: secondUser.id,
      name: secondUser.name,
    },
  );

  setRedirectChatId(room.id);
}

async function savePost(
  userData: {
    id: string;
    savedPosts: string[];
  },
  pid: string,
  unsave: boolean,
) {
  const savedPostsUpdated = unsave
    ? userData.savedPosts.filter((p: string) => p !== pid)
    : removeDuplicates([...userData.savedPosts, pid]);

  const db = getFirestore();
  const ref = doc(db, DB_COLLECTIONS.USERS, userData.id);
  await updateDoc(ref, {
    savedPosts: savedPostsUpdated,
  });

  logEvent(getAnalytics(), ANALYTICS_EVENTS.SAVE_POST);
}

export async function handleSavePost(
  userData: IUserDataWithId | undefined,
  id: string | undefined,
  isSaved: boolean,
  setIsSaved: (s: boolean) => void,
) {
  if (!userData || !id) return;
  await savePost(userData, id, isSaved)
    .then(() => {
      setIsSaved(!isSaved);
      displayNotif(
        isSaved ? 'Removed from saved posts.' : 'Saved post.',
        'success',
      );
    })
    .catch(() => displayNotif('Failed to save post.', 'error'));
}
