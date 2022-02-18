import styles from './CommentSection.module.css';
import { Comment } from '../comment/Comment';
import { CommentModel } from '../../../models/comment';
import { WriteComment } from '../writeComment/WriteComment';
import { PostModel } from '../../../models/post';
import { User } from 'firebase/auth';
import { CommentSkeletons } from './skeletons/CommentSkeletons';

interface ICommentSectionProps {
    user: User | undefined | null;
    post: PostModel | undefined;
    comments: CommentModel[] | undefined;
}

export const CommentSection: React.FC<ICommentSectionProps> = (props) => {
    return (
        <div className={`contentBox ${styles.section}`}>
            {props.comments ? (
                <div className="flex">
                    <p className={styles.textSilver}>
                        {props.comments.length} comments
                    </p>
                    <p
                        className={
                            styles.textUpvotedPercentage +
                            ' ' +
                            styles.textSilver
                        }
                    >
                        {props.post &&
                            props.post.getUpvotedPercentage() + '% upvoted'}
                    </p>
                </div>
            ) : null}
            {props.comments && props.post?.id && (
                <WriteComment
                    user={props.user}
                    postId={props.post.id}
                ></WriteComment>
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
                                user={props.user}
                                data={c as any}
                            ></Comment>
                            {replies.map((r, rIndex: number) => (
                                <Comment
                                    key={rIndex}
                                    user={props.user}
                                    data={r as any}
                                ></Comment>
                            ))}
                        </div>
                    );
                })
            ) : (
                <CommentSkeletons user={props.user} />
            )}
        </div>
    );
};
