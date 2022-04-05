import css from './CommentSection.module.css';
import { Comment } from '../comment/Comment';
import { CommentModel } from '../../../models/comment';
import { WriteComment } from '../writeComment/WriteComment';
import { PostModel } from '../../../models/post';
import { CommentSkeletons } from './skeletons/CommentSkeletons';
import { useState } from 'react';
import { toggleCommentReplies } from './CommentSectionActions';

interface ICommentSectionProps {
    post: PostModel | undefined;
    comments: CommentModel[] | undefined;
}

export const CommentSection: React.FC<ICommentSectionProps> = (props) => {
    const [hiddenComments, setHiddenComments] = useState<string[]>([]);
    return (
        <div className={`contentBox ${css.section}`}>
            {props.comments ? (
                <div className="flex">
                    <p className={css.textSilver}>
                        {props.comments.length} comments
                    </p>
                    <p
                        className={
                            css.textUpvotedPercentage + ' ' + css.textSilver
                        }
                    >
                        {props.post &&
                            props.post.getUpvotedPercentage() + '% upvoted'}
                    </p>
                </div>
            ) : null}
            {props.comments && props.post?.id && (
                <WriteComment postId={props.post.id}></WriteComment>
            )}
            {props.comments ? (
                props.comments.map((c, index: number) => {
                    if (c.isReply || !props.comments) return null;

                    const replies = props.comments.filter(
                        (r) => r.parentCommentId === c.id
                    );
                    return (
                        <div key={index}>
                            <Comment
                                data={c as any}
                                hideComment={(cid) =>
                                    toggleCommentReplies(
                                        cid,
                                        hiddenComments,
                                        setHiddenComments
                                    )
                                }
                            ></Comment>
                            {c.id &&
                                !hiddenComments.includes(c.id) &&
                                replies.map((r, rIndex: number) => (
                                    <Comment key={rIndex} data={r}></Comment>
                                ))}
                        </div>
                    );
                })
            ) : (
                <CommentSkeletons />
            )}
        </div>
    );
};
