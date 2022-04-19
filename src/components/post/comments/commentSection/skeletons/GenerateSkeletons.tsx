import { Comment } from '../../comment/Comment';
import { CommentModel } from '../../../../../models/comment';
import { PostModel } from '../../../../../models/post';
import { POSTS_PER_PAGE } from '../../../../../utils/misc/constants';

/**
 * @returns an array of Comment components with empty data
 *          to serve as loading Skeletons
 */
export function generateCommentSkeletons(num: number): JSX.Element[] {
    const commentSkeletons = [];
    for (let i = 0; i < num; i++) {
        commentSkeletons.push(
            <Comment key={i} data={new CommentModel()}></Comment>
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
