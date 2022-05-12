import css from './WriteComment.module.css';
import React, { useContext, useState } from 'react';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { UserContext } from '../../../../context/UserContext';
import { submitComment } from './WriteCommentActions';
import { TextField } from '@mui/material';
import { UserDataContext } from '../../../../context/UserDataContext';

interface IWriteCommentProps {
    postId: string;
    setVisibility?: Function;
    parentCommentId?: string;
}

export const WriteComment: React.FC<IWriteCommentProps> = props => {
    const user = useContext(UserContext);
    const userData = useContext(UserDataContext);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    return (
        <div className={css.container}>
            <TextField
                autoFocus={props.parentCommentId ? true : false}
                value={comment}
                onChange={e => setComment(e.currentTarget.value)}
                multiline
                color="warning"
                className={css.replyTextarea}
                placeholder={
                    props.parentCommentId ? 'Write a reply' : 'Write a comment'
                }
            />
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
                    className={css.btnSubmit}
                    disabled={isSubmitting}
                    type="submit"
                    onClick={(e: React.MouseEvent) =>
                        submitComment(
                            e,
                            user,
                            userData,
                            comment,
                            setComment,
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
                        />
                    ) : (
                        'Submit'
                    )}
                </button>
            </form>
        </div>
    );
};
