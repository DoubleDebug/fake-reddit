import styles from './Comment.module.css';
import React, { useEffect, useState } from 'react';
import { User } from '@firebase/auth';
import { CommentModel } from '../../../models/comment';
import { getUserPhotoURL } from '../../../utils/firebase/getUserPhotoURL';
import { DEFAULT_USER_AVATAR_URL } from '../../../utils/misc/constants';
import { timeAgo } from '../../../utils/misc/timeAgo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { WriteComment } from '../writeComment/WriteComment';
import { isCommentMine } from '../../../utils/misc/whichUserUtils';
import Skeleton from 'react-loading-skeleton';
import { deleteComment } from './CommentActions';

interface ICommentProps {
    user: User | undefined | null;
    data: CommentModel;
}

export const Comment: React.FC<ICommentProps> = (props) => {
    const [authorPhotoURL, setAuthorPhotoURL] = useState(
        DEFAULT_USER_AVATAR_URL
    );
    const [showReply, setShowReply] = useState(false);

    useEffect(() => {
        if (!props.data.authorId) return;

        // fetch comment author's photo url
        getUserPhotoURL(props.data.authorId).then((url) => {
            if (url) setAuthorPhotoURL(url);
        });
        // eslint-disable-next-line
    }, []);

    return (
        <div
            className={`${styles.comment} ${
                props.data.isReply ? styles.isReply : ''
            }`}
        >
            {props.data.author ? (
                <div className={styles.header}>
                    <img
                        alt=""
                        src={authorPhotoURL}
                        className={styles.imgAvatar}
                    ></img>
                    <small className={styles.author}>{props.data.author}</small>
                    <small className={styles.timeAgo}>
                        {`• ${timeAgo(props.data.createdAt.toDate())}`}
                    </small>
                    {props.user && isCommentMine(props.data, props.user) ? (
                        <p
                            className={styles.btnCommentAction}
                            onClick={() => deleteComment(props.data)}
                        >
                            Delete{' '}
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
                            Reply{' '}
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
            <p className={styles.text}>{props.data.text}</p>
            {showReply && (
                <WriteComment
                    user={props.user}
                    postId={props.data.postId || ''}
                    setVisibility={setShowReply}
                    parentCommentId={props.data.id}
                ></WriteComment>
            )}
        </div>
    );
};
