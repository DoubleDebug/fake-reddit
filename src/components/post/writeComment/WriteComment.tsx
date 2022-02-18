import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import styles from './WriteComment.module.css';
import { submitComment } from './WriteCommentActions';

interface IWriteCommentProps {
    user: User | undefined | null;
    postId: string;
    setVisibility?: Function;
    parentCommentId?: string;
}

export const WriteComment: React.FC<IWriteCommentProps> = (props) => {
    const commentTextarea = useRef<HTMLTextAreaElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (props.parentCommentId) commentTextarea.current?.focus();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="grid">
            <textarea
                ref={commentTextarea}
                className={styles.replyTextarea}
                placeholder={
                    props.parentCommentId ? 'Write a reply' : 'Write a comment'
                }
            ></textarea>
            <form className={styles.replyForm}>
                {props.setVisibility ? (
                    <p
                        className={styles.btnCancel}
                        onClick={() =>
                            props.setVisibility && props.setVisibility(false)
                        }
                    >
                        Cancel
                    </p>
                ) : null}
                <button
                    className={`btn ${styles.btnSubmit}`}
                    disabled={isSubmitting}
                    type="submit"
                    onClick={(e: React.MouseEvent) =>
                        submitComment(
                            e,
                            props.user,
                            commentTextarea,
                            props.parentCommentId,
                            props.postId,
                            setIsSubmitting
                        )
                    }
                >
                    {isSubmitting ? (
                        <FontAwesomeIcon
                            icon={faCircleNotch}
                            spin={true}
                            style={{ margin: '0 1.2rem' }}
                        ></FontAwesomeIcon>
                    ) : (
                        'Submit'
                    )}
                </button>
            </form>
        </div>
    );
};
