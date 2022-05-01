import { Comment } from '../../comment/Comment';
import { CommentModel } from '../../../../../models/comment';
import { PostModel } from '../../../../../models/post';
import {
    COMMENTS_PER_PAGE,
    POSTS_PER_PAGE,
} from '../../../../../utils/misc/constants';

/**
 * @returns an array of Comment components with empty data
 *          to serve as loading Skeletons
 */
export function generateCommentSkeletonsJSX(): JSX.Element[] {
    const commentSkeletons = [];
    for (let i = 0; i < COMMENTS_PER_PAGE; i++) {
        commentSkeletons.push(<Comment key={i} data={new CommentModel()} />);
    }
    return commentSkeletons;
}
/**
 * @returns an array of empty comments
 *          to serve as loading skeletons
 */
export function generateCommentSkeletons(): CommentModel[] {
    return Array(COMMENTS_PER_PAGE).fill(new CommentModel());
}

/**
 * @returns an array of empty posts
 *          to serve as loading skeletons
 */
export function generatePostSkeletons(): PostModel[] {
    return Array(POSTS_PER_PAGE).fill(new PostModel());
}
