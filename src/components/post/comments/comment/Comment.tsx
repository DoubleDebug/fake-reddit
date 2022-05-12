import css from './Comment.module.css';
import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { CommentModel } from '../../../../models/comment';
import { DEFAULT_PROFILE_URL } from '../../../../utils/misc/constants';
import { timeAgo } from '../../../../utils/misc/timeAgo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { WriteComment } from '../writeComment/WriteComment';
import { isCommentMine } from '../../../../utils/misc/whichUserUtils';
import { deleteComment } from './CommentActions';
import { UserContext } from '../../../../context/UserContext';
import { getUserPhotoURL } from '../../../../utils/firebase/getUserPhotoURL';
import { Link } from 'react-router-dom';

interface ICommentProps {
    data: CommentModel;
    hideComment?: (id: string | undefined) => void;
}

export const Comment: React.FC<ICommentProps> = props => {
    const user = useContext(UserContext);
    const [authorPhotoURL, setAuthorPhotoURL] = useState(DEFAULT_PROFILE_URL);
    const [showReply, setShowReply] = useState(false);

    useEffect(() => {
        if (!props.data.authorId) return;

        // get comment author's photo url
        getUserPhotoURL(props.data.authorId).then(
            url => url && setAuthorPhotoURL(url)
        );
        // eslint-disable-next-line
    }, []);

    return (
        <div
            className={`${css.comment} ${
                props.data.isReply ? css.isReply : ''
            }`}
        >
            {props.data.id && (
                <img alt="U" src={authorPhotoURL} className={css.imgAvatar} />
            )}
            {props.data.author ? (
                <div className={css.header}>
                    <Link to={`/user/${props.data.author}`}>
                        {' '}
                        <small className={css.author}>
                            {props.data.author}
                        </small>
                    </Link>
                    <small className={css.timeAgo}>
                        {`• ${timeAgo(props.data.createdAt.toDate())}`}
                    </small>
                    {user && isCommentMine(props.data, user) ? (
                        <p
                            className={css.btnCommentAction}
                            onClick={() => deleteComment(user, props.data.id)}
                        >
                            Delete
                            <FontAwesomeIcon
                                icon={faTrash}
                                style={{
                                    marginLeft: '0.2rem',
                                    marginRight: '0.5rem'
                                }}
                            />
                        </p>
                    ) : null}
                    {!props.data.isReply && (
                        <p
                            className={css.btnCommentAction}
                            onClick={() => setShowReply(true)}
                        >
                            Reply
                            <FontAwesomeIcon
                                icon={faCommentAlt}
                                size="sm"
                                style={{
                                    marginLeft: '0.2rem',
                                    marginRight: '0.5rem'
                                }}
                            />
                        </p>
                    )}
                </div>
            ) : (
                <div className={css.skeletonContainer}>
                    <div className="flex">
                        <Skeleton circle={true} width="20px" />
                        <Skeleton
                            width="80px"
                            style={{ marginLeft: '0.5rem' }}
                        />
                        <Skeleton
                            width="80px"
                            style={{ marginLeft: '0.5rem' }}
                        />
                    </div>
                    <Skeleton count={3} />
                </div>
            )}
            {props.data.id && !props.data.isReply && (
                <button
                    className={css.btnExpand}
                    onClick={() =>
                        props.hideComment && props.hideComment(props.data.id)
                    }
                />
            )}
            {props.data.isReply && <div></div>}
            <p className={css.text}>{props.data.text}</p>
            <div></div>
            {showReply && (
                <WriteComment
                    postId={props.data.postId || ''}
                    setVisibility={setShowReply}
                    parentCommentId={props.data.id}
                />
            )}
        </div>
    );
};
