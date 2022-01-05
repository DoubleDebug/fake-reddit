import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from 'firebase/auth';
import { addDoc, collection, Firestore, Timestamp } from 'firebase/firestore';
import { DB_COLLECTIONS } from '../../utils/constants';
import React, { useEffect, useRef, useState } from 'react';
import styles from './WriteComment.module.css';

interface IWriteCommentProps {
    user: User | undefined | null;
    firestore: Firestore;
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

    // ACTIONS
    const submitComment = (e: React.MouseEvent) => {
        e.preventDefault();

        // data validation
        if (
            !props.user ||
            !commentTextarea.current ||
            commentTextarea.current.value === ''
        )
            return;

        // gathering data
        setIsSubmitting(true);
        let data: any = {
            author: props.user.displayName,
            authorId: props.user.uid,
            createdAt: Timestamp.now(),
            isReply: props.parentCommentId ? true : false,
            postId: props.postId,
            text: commentTextarea.current.value,
        };

        if (props.parentCommentId) {
            data = { ...data, parentCommentId: props.parentCommentId };
        }

        // submitting data to firestore
        addDoc(collection(props.firestore, DB_COLLECTIONS.COMMENTS), data).then(
            () => {
                if (commentTextarea.current) commentTextarea.current.value = '';
                setIsSubmitting(false);
            }
        );
    };

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
                    onClick={(e: React.MouseEvent) => submitComment(e)}
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
