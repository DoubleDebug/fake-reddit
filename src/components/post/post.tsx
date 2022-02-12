import 'react-loading-skeleton/dist/skeleton.css';
import styles from './Post.module.css';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { timeAgo } from '../../utils/timeAgo';
import { PostModel } from '../../models/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronCircleDown,
    faChevronCircleUp,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Firestore } from '@firebase/firestore';
import { Link, Redirect } from 'react-router-dom';
import { createChatRoom } from '../../pages/chat/createChatRoom';
import { User } from 'firebase/auth';
import { Markup } from 'interweave';

interface IPostProps {
    data: PostModel;
    user: User | undefined | null;
    firestore: Firestore;
    isPreview?: boolean;
}

export const Post: React.FC<IPostProps> = (props) => {
    const [score, setScore] = useState(props.data.getScore());
    const [upvoted, setUpvoted] = useState<boolean | null>(null);
    const [deleted, setDeleted] = useState(false);
    const [redirectChatId, setRedirectChatId] = useState<string | null>(null);

    useEffect(() => {
        if (props.user) {
            setUpvoted(props.data.getUsersVote(props.user.uid));
        }
        setScore(props.data.getScore());
    }, [props.user, props.data]);

    // ACTIONS
    const upvote = () => {
        if (!props.user || !props.data.id) return;

        props.data.upvote(props.firestore, props.user.uid);

        if (upvoted === true) {
            setUpvoted(null);
            setScore(score - 1);
        } else if (upvoted === false) {
            setUpvoted(true);
            setScore(score + 2);
        } else {
            setUpvoted(true);
            setScore(score + 1);
        }
    };

    const downvote = () => {
        if (!props.user || !props.data.id) return;

        props.data.downvote(props.firestore, props.user.uid);

        if (upvoted === false) {
            setUpvoted(null);
            setScore(score + 1);
        } else if (upvoted === true) {
            setUpvoted(false);
            setScore(score - 2);
        } else {
            setUpvoted(false);
            setScore(score - 1);
        }
    };

    const deletePost = () => {
        if (!props.user || !props.data.id) return;

        props.data.delete(props.user, props.firestore, props.data.subreddit);

        setDeleted(true);
    };

    const openChatRoom = async () => {
        if (!props.user || !props.data.id) return;
        const room = await createChatRoom(
            props.firestore,
            {
                id: props.user.uid,
                name: props.user.displayName!,
            },
            {
                id: props.data.authorId!,
                name: props.data.author,
            }
        );

        setRedirectChatId(room.id);
    };

    if (redirectChatId)
        return <Redirect to={`/chat/${redirectChatId}`}></Redirect>;
    if (deleted) return null;
    return (
        <div className={`contentBox ${styles.container}`}>
            <div className={styles.postHeader}>
                <div className={styles.postVoting}>
                    <h2 className={styles.score}>{score}</h2>
                    <div className={styles.arrows}>
                        <FontAwesomeIcon
                            icon={faChevronCircleUp}
                            color={upvoted ? 'darkorange' : 'silver'}
                            size="lg"
                            className={'btn ' + styles.btnVote}
                            onClick={() => upvote()}
                            title="Upvote"
                        />
                        <FontAwesomeIcon
                            icon={faChevronCircleDown}
                            color={
                                upvoted === false ? 'lightskyblue' : 'silver'
                            }
                            size="lg"
                            className={'btn ' + styles.btnVote}
                            onClick={() => downvote()}
                            title="Downvote"
                        />
                    </div>
                </div>
                <div className={styles.postBody}>
                    <div className={styles.authorAndDate}>
                        {props.data.id && (
                            <Link to={`/r/${props.data.subreddit}`}>
                                <strong
                                    className={styles.subreddit}
                                >{`r/${props.data.subreddit}`}</strong>
                            </Link>
                        )}
                        <div className={styles.secondaryText}>
                            {props.data.author ? (
                                <div className="flex">
                                    <small>Posted by </small>
                                    <small
                                        onClick={
                                            props.user?.uid ===
                                            props.data.authorId
                                                ? undefined
                                                : () => openChatRoom()
                                        }
                                        className={styles.author}
                                        title={`Chat with ${props.data.author}`}
                                    >
                                        {props.data.author}
                                    </small>
                                </div>
                            ) : (
                                <Skeleton width="200px" />
                            )}
                        </div>
                        <small>
                            <Link
                                to={`/post/${props.data.id}`}
                                title="Open post"
                                className={
                                    styles.secondaryText + ' ' + styles.timeAgo
                                }
                            >
                                {props.data.title &&
                                    timeAgo(props.data.createdAt.toDate())}
                            </Link>
                        </small>
                    </div>
                    {props.data.title ? (
                        props.isPreview ? (
                            <Link
                                className={styles.title}
                                to={`/post/${props.data.id}`}
                            >
                                {props.data.title}
                            </Link>
                        ) : (
                            <p className={styles.title}>{props.data.title}</p>
                        )
                    ) : (
                        <Skeleton width="400px" height="30px" />
                    )}
                </div>
            </div>
            {props.user ? (
                props.data.authorId === props.user.uid ? (
                    <FontAwesomeIcon
                        className={'btn ' + styles.btnDelete}
                        icon={faTrash}
                        color="silver"
                        title="Delete post"
                        onClick={() => deletePost()}
                    ></FontAwesomeIcon>
                ) : (
                    <div></div>
                )
            ) : (
                <div></div>
            )}

            <Link
                className={`${styles.linkToPost} ${
                    props.isPreview ? styles.isPreview : styles.isNotPreview
                }`}
                to={`/post/${props.data.id}`}
            >
                <div
                    className={`${styles.postContent} ${
                        props.isPreview ? styles.preview : ''
                    }`}
                >
                    <Markup content={props.data.content}></Markup>
                    {!props.data.content && <Skeleton count={5} />}
                    {props.isPreview ? (
                        <div className={styles.fade}></div>
                    ) : null}
                </div>
            </Link>
        </div>
    );
};
