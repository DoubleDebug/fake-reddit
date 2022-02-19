import { User } from 'firebase/auth';
import { PostModel } from '../../models/post';
import { createChatRoom } from '../../pages/chat/ChatActions';

export function upvote(
    user: User | null | undefined,
    data: PostModel,
    upvoted: boolean | null,
    score: number,
    setUpvoted: (u: boolean | null) => void,
    setScore: (s: number) => void
) {
    if (!user || !data.id) return;

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
    if (!user || !data.id) return;

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
    user: User | null | undefined,
    data: PostModel,
    setRedirectChatId: (id: string | null) => void
) {
    if (!user || !data.id) return;
    const room = await createChatRoom(
        {
            id: user.uid,
            name: user.displayName!,
        },
        {
            id: data.authorId!,
            name: data.author,
        }
    );

    setRedirectChatId(room.id);
}
