import { doc, getDoc, getFirestore } from 'firebase/firestore';
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
