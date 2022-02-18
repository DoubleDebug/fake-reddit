import { User } from 'firebase/auth';
import { POSTS_PER_PAGE } from '../../../../utils/misc/constants';
import { generateCommentSkeletons } from './GenerateSkeletons';

interface ICommentSkeletonsProps {
    user: User | null | undefined;
}

export const CommentSkeletons: React.FC<ICommentSkeletonsProps> = (props) => {
    return (
        <div className="grid">
            {generateCommentSkeletons(POSTS_PER_PAGE, props.user)}
        </div>
    );
};
