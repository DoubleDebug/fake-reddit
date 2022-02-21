import styles from './Comment.module.css';
import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { CommentModel } from '../../../models/comment';
import { DEFAULT_PROFILE_URL } from '../../../utils/misc/constants';
import { timeAgo } from '../../../utils/misc/timeAgo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { WriteComment } from '../writeComment/WriteComment';
import { isCommentMine } from '../../../utils/misc/whichUserUtils';
import { deleteComment, getUsersPhotoURL } from './CommentActions';
import { UserContext } from '../../../context/UserContext';

interface ICommentProps {
    data: CommentModel;
    hideComment?: (id: string | undefined) => void;
}

export const Comment: React.FC<ICommentProps> = (props) => {
    const user = useContext(UserContext);
    const [authorPhotoURL, setAuthorPhotoURL] = useState(DEFAULT_PROFILE_URL);
    const [showReply, setShowReply] = useState(false);

    useEffect(() => {
        if (!props.data.authorId) return;

        // get comment author's photo url
        getUsersPhotoURL(props.data.authorId, setAuthorPhotoURL);
        // eslint-disable-next-line
    }, []);

    return (
        <div
            className={`${styles.comment} ${
                props.data.isReply ? styles.isReply : ''
            }`}
        >
            <img
                alt="U"
                src={authorPhotoURL}
                className={styles.imgAvatar}
            ></img>
            {props.data.author ? (
                <div className={styles.header}>
                    <small className={styles.author}>{props.data.author}</small>
                    <small className={styles.timeAgo}>
                        {`• ${timeAgo(props.data.createdAt.toDate())}`}
                    </small>
                    {user && isCommentMine(props.data, user) ? (
                        <p
                            className={styles.btnCommentAction}
                            onClick={() => deleteComment(props.data)}
                        >
                            Delete
                            <FontAwesomeIcon
                                icon={faTrash}
                                style={{ marginRight: '0.5rem' }}
                            ></FontAwesomeIcon>
                        </p>
                    ) : null}
                    {!props.data.isReply && (
                        <p
                            className={styles.btnCommentAction}
                            onClick={() => setShowReply(true)}
                        >
                            Reply
                            <FontAwesomeIcon
                                icon={faCommentAlt}
                                size="sm"
                            ></FontAwesomeIcon>
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid">
                    <div className="flex">
                        <Skeleton circle={true} width="20px"></Skeleton>
                        <Skeleton
                            width="80px"
                            style={{ marginLeft: '0.5rem' }}
                        ></Skeleton>
                        <Skeleton
                            width="80px"
                            style={{ marginLeft: '0.5rem' }}
                        ></Skeleton>
                    </div>
                    <Skeleton count={3}></Skeleton>
                </div>
            )}
            {!props.data.isReply && (
                <button
                    className={styles.btnExpand}
                    onClick={() =>
                        props.hideComment && props.hideComment(props.data.id)
                    }
                />
            )}
            <p className={styles.text}>{props.data.text}</p>
            <div></div>
            {showReply && (
                <WriteComment
                    postId={props.data.postId || ''}
                    setVisibility={setShowReply}
                    parentCommentId={props.data.id}
                ></WriteComment>
            )}
        </div>
    );
};
