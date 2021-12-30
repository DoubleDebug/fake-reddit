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
import { Link, useHistory } from 'react-router-dom';
import { createChatRoom } from '../../pages/chat/createChatRoom';
import { User } from 'firebase/auth';

interface IPostProps {
    data: PostModel;
    user: User | undefined | null;
    firestore: Firestore;
}

export const Post: React.FC<IPostProps> = (props) => {
    const history = useHistory();
    const [score, setScore] = useState(props.data.getScore());
    const [upvoted, setUpvoted] = useState<boolean | null>(null);

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
    };

    const downvote = () => {
        if (!props.user || !props.data.id) return;

        props.data.downvote(props.firestore, props.user.uid);
    };

    const deletePost = () => {
        if (!props.user || !props.data.id) return;

        props.data.delete(props.firestore);
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

        history.push('/chat', { roomId: room.id });
    };
    return (
        <div className={styles.post}>
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
                        <div className={styles.secondaryText}>
                            {props.data.author ? (
                                <div>
                                    <small>Posted by </small>
                                    <a
                                        href="/#"
                                        onClick={() => openChatRoom()}
                                        className={styles.author}
                                        title={`Chat with ${props.data.author}`}
                                    >
                                        {props.data.author}
                                    </a>
                                </div>
                            ) : (
                                <Skeleton width="200px" />
                            )}
                        </div>
                        <small>
                            <Link
                                className={
                                    styles.secondaryText + ' ' + styles.timeAgo
                                }
                                to={`/post/${props.data.id}`}
                            >
                                {props.data.title &&
                                    timeAgo(props.data.createdAt.toDate())}
                            </Link>
                        </small>
                    </div>
                    <p className={styles.title}>
                        {props.data.title || (
                            <Skeleton width="400px" height="30px" />
                        )}
                    </p>
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
            <div className={styles.postContent}>
                {props.data.content || <Skeleton count={5} />}
            </div>
        </div>
    );
};
