import { POSTS_PER_PAGE } from '../misc/constants';

/**
 * @returns TRUE if the current offset has reached the last document in collection
 */
export function reachedLastDocument(
    offset: number,
    totalNumOfPosts: number
): boolean {
    return offset + POSTS_PER_PAGE >= totalNumOfPosts;
}
