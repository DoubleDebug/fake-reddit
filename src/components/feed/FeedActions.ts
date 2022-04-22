import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { PostModel } from '../../models/post';
import { DB_COLLECTIONS } from '../../utils/misc/constants';

export function handleBackToTopEvent(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

export async function getTotalNumOfPosts(
    subreddits: string[]
): Promise<number> {
    const numOfPosts = (
        await getDoc(doc(getFirestore(), DB_COLLECTIONS.METADATA, 'numOfPosts'))
    ).data();
    if (!numOfPosts) return 0;

    return subreddits.reduce((sum, s) => (sum += numOfPosts[s]), 0);
}

export function filterPosts(posts: PostModel[]) {
    // remove duplicates
    const uniqueIds = Array.from(new Set(posts.map((p) => p.id)));
    const uniquePosts = uniqueIds.map(
        (id) => posts.filter((p) => p.id === id)[0]
    );

    // remove skeletons
    return uniquePosts.filter((p) => p.id);
}
