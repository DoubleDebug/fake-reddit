import css from '../comment/Comment.module.css';
import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { CommentModel } from '../../../../models/comment';
import { DEFAULT_PROFILE_URL } from '../../../../utils/misc/constants';
import { timeAgo } from '../../../../utils/misc/timeAgo';
import { getUserPhotoURL } from '../../../../utils/firebase/getUserPhotoURL';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isCommentMine } from '../../../../utils/misc/whichUserUtils';
import { deleteComment } from '../comment/CommentActions';
import { UserContext } from '../../../../context/UserContext';

interface ICommentPreviewProps {
    data: CommentModel;
    onDelete: () => void;
}

export const CommentPreview: React.FC<ICommentPreviewProps> = (props) => {
    const user = useContext(UserContext);
    const [authorPhotoURL, setAuthorPhotoURL] = useState(DEFAULT_PROFILE_URL);

    useEffect(() => {
        if (!props.data.authorId) return;

        // get comment author's photo url
        getUserPhotoURL(props.data.authorId).then(
            (url) => url && setAuthorPhotoURL(url)
        );
        // eslint-disable-next-line
    }, []);

    return (
        <div className={`contentBox ${css.comment} ${css.commentPreview}`}>
            {props.data.id && (
                <img alt="U" src={authorPhotoURL} className={css.imgAvatar} />
            )}
            {props.data.author ? (
                <div className={css.header}>
                    <small className={css.author}>
                        {props.data.author}
                        <small className={css.lblCommentedOn}>
                            commented on{' '}
                        </small>
                        <a href={`/post/${props.data.postId}`}>this post</a>
                    </small>
                    <small className={css.timeAgo}>
                        {`(${timeAgo(props.data.createdAt.toDate())})`}
                    </small>
                    {user && isCommentMine(props.data, user) ? (
                        <p
                            className={css.btnCommentAction}
                            onClick={() => {
                                deleteComment(user, props.data.id);
                                props.onDelete();
                            }}
                        >
                            Delete
                            <FontAwesomeIcon
                                icon={faTrash}
                                style={{
                                    marginLeft: '0.2rem',
                                    marginRight: '0.5rem',
                                }}
                            />
                        </p>
                    ) : null}
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
            <div></div>
            <p className={css.text}>{props.data.text}</p>
            <div></div>
        </div>
    );
};
