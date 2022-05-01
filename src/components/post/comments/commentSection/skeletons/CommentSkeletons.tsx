import { generateCommentSkeletonsJSX } from './GenerateSkeletons';

export const CommentSkeletons: React.FC = () => {
    return <div className="grid">{generateCommentSkeletonsJSX()}</div>;
};
