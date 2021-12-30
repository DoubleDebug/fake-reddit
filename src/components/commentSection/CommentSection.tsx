import styles from './CommentSection.module.css';
import { Comment } from '../comment/Comment';
import { CommentModel } from '../../models/comment';
import { WriteComment } from '../writeComment/WriteComment';
import { PostModel } from '../../models/post';
import { Firestore } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface ICommentSectionProps {
    firestore: Firestore;
    user: User | undefined | null;
    post: PostModel | undefined;
    comments: CommentModel[] | undefined;
}

export const CommentSection: React.FC<ICommentSectionProps> = (props) => {
    return (
        <div className={styles.commentsSection}>
            {props.comments ? (
                <div className="flex">
                    <p className={styles.textSilver}>
                        {props.comments.length} comments
                    </p>
                    <p className={styles.textUpvotedPercentage}>
                        {props.post?.getUpvotedPercentage() + '% upvoted'}
                    </p>
                </div>
            ) : null}
            {props.comments && props.post?.id && (
                <WriteComment
                    firestore={props.firestore}
                    user={props.user}
                    postId={props.post.id}
                ></WriteComment>
            )}
            {props.comments
                ? props.comments.map((c, index: number) => {
                      if (c.isReply || !props.comments) return null;

                      const replies = props.comments.filter(
                          (r) => r.parentCommentId === c.id
                      );
                      return (
                          <>
                              <Comment
                                  key={index}
                                  user={props.user}
                                  firestore={props.firestore}
                                  data={c as any}
                              ></Comment>
                              {replies.map((r, rIndex: number) => (
                                  <Comment
                                      key={rIndex}
                                      user={props.user}
                                      firestore={props.firestore}
                                      data={r as any}
                                  ></Comment>
                              ))}
                          </>
                      );
                  })
                : Array(3).fill(
                      <Comment
                          user={props.user}
                          firestore={props.firestore}
                          data={new CommentModel()}
                      ></Comment>
                  )}
        </div>
    );
};
