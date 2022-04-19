import { POSTS_PER_PAGE } from '../../../../../utils/misc/constants';
import { generateCommentSkeletons } from './GenerateSkeletons';

export const CommentSkeletons: React.FC = () => {
    return (
        <div className="grid">{generateCommentSkeletons(POSTS_PER_PAGE)}</div>
    );
};
