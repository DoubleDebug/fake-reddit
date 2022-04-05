import css from './WriteComment.module.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../../context/UserContext';
import { submitComment } from './WriteCommentActions';

interface IWriteCommentProps {
    postId: string;
    setVisibility?: Function;
    parentCommentId?: string;
}

export const WriteComment: React.FC<IWriteCommentProps> = (props) => {
    const user = useContext(UserContext);
    const commentTextarea = useRef<HTMLTextAreaElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (props.parentCommentId) commentTextarea.current?.focus();
        // eslint-disable-next-line
    }, []);

    return (
        <div className={css.container}>
            <textarea
                ref={commentTextarea}
                className={css.replyTextarea}
                placeholder={
                    props.parentCommentId ? 'Write a reply' : 'Write a comment'
                }
            ></textarea>
            <form className={css.replyForm}>
                {props.setVisibility ? (
                    <p
                        className={css.btnCancel}
                        onClick={() =>
                            props.setVisibility && props.setVisibility(false)
                        }
                    >
                        Cancel
                    </p>
                ) : null}
                <button
                    className={`btn ${css.btnSubmit}`}
                    disabled={isSubmitting}
                    type="submit"
                    onClick={(e: React.MouseEvent) =>
                        submitComment(
                            e,
                            user,
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
