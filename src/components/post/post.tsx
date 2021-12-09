import 'react-loading-skeleton/dist/skeleton.css';
import './post.css';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { timeAgo } from '../../utils/timeAgo';
import { User } from '@firebase/auth';
import { PostModel } from '../../models/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronCircleDown,
    faChevronCircleUp,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Firestore } from '@firebase/firestore';
import { useHistory } from 'react-router-dom';
import { createChatRoom } from '../../pages/chat/createChatRoom';

interface IPostProps {
    data: PostModel;
    user: User | null | undefined;
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
        // update database
        props.data.upvote(props.firestore, props.user.uid);

        // update ui
        if (upvoted === null) setScore(score + 1);
        else if (upvoted === true) {
            setScore(score - 1);
            setUpvoted(null);
            return;
        } else setScore(score + 2);
        setUpvoted(true);
    };

    const downvote = () => {
        if (!props.user || !props.data.id) return;
        // update database
        props.data.downvote(props.firestore, props.user.uid);
        // update ui
        if (upvoted === null) setScore(score - 1);
        else if (upvoted === false) {
            setScore(score + 1);
            setUpvoted(null);
            return;
        } else setScore(score - 2);
        setUpvoted(false);
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
        <div className="post">
            <div className="postHeader">
                <div className="postVoting">
                    <h2 className="score">{score}</h2>
                    <div className="arrows">
                        <FontAwesomeIcon
                            icon={faChevronCircleUp}
                            color={upvoted ? 'darkorange' : 'silver'}
                            size="lg"
                            className="btn btnVote"
                            onClick={() => upvote()}
                            title="Upvote"
                        />
                        <FontAwesomeIcon
                            icon={faChevronCircleDown}
                            color={
                                upvoted === false ? 'lightskyblue' : 'silver'
                            }
                            size="lg"
                            className="btn btnVote"
                            onClick={() => downvote()}
                            title="Downvote"
                        />
                    </div>
                </div>
                <div className="postBody">
                    <div className="authorAndDate">
                        <div className="secondaryText">
                            {props.data.author ? (
                                <div>
                                    <small>Posted by </small>
                                    <a
                                        href="/#"
                                        onClick={() => openChatRoom()}
                                        className="author"
                                        title={`Chat with ${props.data.author}`}
                                    >
                                        {props.data.author}
                                    </a>
                                </div>
                            ) : (
                                <Skeleton width="200px" />
                            )}
                        </div>
                        <small className="secondaryText timeAgo">
                            {props.data.title &&
                                timeAgo(props.data.createdAt.toDate())}
                        </small>
                    </div>
                    <p className="title">
                        {props.data.title || (
                            <Skeleton width="400px" height="30px" />
                        )}
                    </p>
                </div>
            </div>
            {props.data.content && props.user ? (
                props.data.authorId === props.user!.uid ? (
                    <FontAwesomeIcon
                        className="btn btnDelete"
                        icon={faTrash}
                        color="silver"
                        title="Delete post"
                        onClick={() => deletePost()}
                    ></FontAwesomeIcon>
                ) : (
                    <div></div>
                )
            ) : (
                <Skeleton width="25px" height="25px" />
            )}
            <div className="postContent">
                {props.data.content || <Skeleton count={7} />}
            </div>
        </div>
    );
};
