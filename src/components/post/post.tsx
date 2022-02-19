import 'react-loading-skeleton/dist/skeleton.css';
import styles from './Post.module.css';
import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { timeAgo } from '../../utils/misc/timeAgo';
import { PostModel } from '../../models/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronCircleDown,
    faChevronCircleUp,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import { deletePost, downvote, openChatRoom, upvote } from './PostActions';
import { PostContent } from './PostContent';
import { UserContext } from '../../context/UserContext';

interface IPostProps {
    data: PostModel;
    isPreview?: boolean;
}

export const Post: React.FC<IPostProps> = (props) => {
    const user = useContext(UserContext);
    const [score, setScore] = useState(props.data.getScore());
    const [upvoted, setUpvoted] = useState<boolean | null>(null);
    const [deleted, setDeleted] = useState(false);
    const [redirectChatId, setRedirectChatId] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState<boolean>(false);

    useEffect(() => {
        // loading component state from db data
        if (user) {
            setUpvoted(props.data.getUsersVote(user.uid));

            if (
                props.data.pollData &&
                props.data.pollData.votes.map((v) => v.uid).includes(user.uid)
            ) {
                setHasVoted(true);
            }
        }
        setScore(props.data.getScore());
    }, [user, props.data]);

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
                            onClick={() =>
                                upvote(
                                    user,
                                    props.data,
                                    upvoted,
                                    score,
                                    setUpvoted,
                                    setScore
                                )
                            }
                            title="Upvote"
                        />
                        <FontAwesomeIcon
                            icon={faChevronCircleDown}
                            color={
                                upvoted === false ? 'lightskyblue' : 'silver'
                            }
                            size="lg"
                            className={'btn ' + styles.btnVote}
                            onClick={() =>
                                downvote(
                                    user,
                                    props.data,
                                    upvoted,
                                    score,
                                    setUpvoted,
                                    setScore
                                )
                            }
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
                                            user?.uid === props.data.authorId
                                                ? undefined
                                                : () =>
                                                      openChatRoom(
                                                          user,
                                                          props.data,
                                                          setRedirectChatId
                                                      )
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
            {user ? (
                props.data.authorId === user.uid ? (
                    <FontAwesomeIcon
                        className={'btn ' + styles.btnDelete}
                        icon={faTrash}
                        color="silver"
                        title="Delete post"
                        onClick={() => deletePost(user, props.data, setDeleted)}
                    ></FontAwesomeIcon>
                ) : (
                    <div></div>
                )
            ) : (
                <div></div>
            )}
            {props.isPreview ? (
                <Link
                    className={`${styles.linkToPost} ${styles.isPreview}`}
                    to={`/post/${props.data.id}`}
                >
                    <PostContent
                        data={props.data}
                        isPreview={props.isPreview}
                        hasVoted={hasVoted}
                    />
                </Link>
            ) : (
                <PostContent
                    data={props.data}
                    isPreview={props.isPreview}
                    hasVoted={hasVoted}
                />
            )}
        </div>
    );
};
