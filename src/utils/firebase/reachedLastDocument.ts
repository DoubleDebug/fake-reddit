import { POSTS_PER_PAGE } from '../constants';

/**
 * @returns TRUE if the current offset has reached the last document in collection
 */
export function reachedLastDocument(
    offset: number,
    totalNumOfPosts: number
): boolean {
    return offset + 2 * POSTS_PER_PAGE >= totalNumOfPosts;
}
