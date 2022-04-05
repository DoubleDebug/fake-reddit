import { User } from 'firebase/auth';
import { PostModel } from '../../models/post';
import { createChatRoom } from '../../pages/inbox/chat/ChatActions';
import { signInPopup } from '../../utils/signInPopup/SignInPopup';
import { displayNotifJSX } from '../../utils/misc/toast';

export function upvote(
    user: User | null | undefined,
    data: PostModel,
    upvoted: boolean | null,
    score: number,
    setUpvoted: (u: boolean | null) => void,
    setScore: (s: number) => void
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
}

export function downvote(
    user: User | null | undefined,
    data: PostModel,
    upvoted: boolean | null,
    score: number,
    setUpvoted: (u: boolean | null) => void,
    setScore: (s: number) => void
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
}

export function deletePost(
    user: User | null | undefined,
    data: PostModel,
    setDeleted: (d: boolean) => void
) {
    if (!user || !data.id) return;

    data.delete(user, data.subreddit);

    setDeleted(true);
}

export async function openChatRoom(
    me: User | null | undefined,
    secondUser: {
        id: string;
        name: string;
    },
    setRedirectChatId: (id: string | null) => void
) {
    if (!me) {
        displayNotifJSX(() =>
            signInPopup(
                `chat with ${secondUser.name.substring(
                    0,
                    secondUser.name.indexOf(' ')
                )}`
            )
        );
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
        }
    );

    setRedirectChatId(room.id);
}
