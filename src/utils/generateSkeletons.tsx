import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Comment } from '../components/post/comment/Comment';
import { CommentModel } from '../models/comment';
import { PostModel } from '../models/post';
import { POSTS_PER_PAGE } from './constants';

/**
 * @returns an array of Comment components with empty data
 *          to serve as loading Skeletons
 */
export function generateCommentSkeletons(
    num: number,
    user: User | null | undefined,
    firestore: Firestore
): JSX.Element[] {
    const commentSkeletons = [];
    for (let i = 0; i < num; i++) {
        commentSkeletons.push(
            <Comment
                key={i}
                user={user}
                firestore={firestore}
                data={new CommentModel()}
            ></Comment>
        );
    }
    return commentSkeletons;
}

/**
 * @returns an array of empty posts
 *          to serve as loading skeletons
 */
export function generatePostSkeletons(): PostModel[] {
    return Array(POSTS_PER_PAGE).fill(new PostModel());
}
