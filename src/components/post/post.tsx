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
} from '@fortawesome/free-solid-svg-icons';
import { Firestore } from '@firebase/firestore';

interface IPostProps {
    data: PostModel;
    user: User | null | undefined;
    firestore: Firestore;
}

export const Post: React.FC<IPostProps> = (props) => {
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
        props.data.upvote(props.firestore, props.data.id, props.user.uid);

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
        props.data.downvote(props.firestore, props.data.id, props.user.uid);
        // update ui
        if (upvoted === null) setScore(score - 1);
        else if (upvoted === false) {
            setScore(score + 1);
            setUpvoted(null);
            return;
        } else setScore(score - 2);
        setUpvoted(false);
    };

    return (
        <div className="post">
            <div className="postHeader">
                <div className="flex">
                    <div className="postVoting">
                        <h2 className="score">{score}</h2>
                        <div className="arrows">
                            <FontAwesomeIcon
                                icon={faChevronCircleUp}
                                color={upvoted ? 'darkorange' : 'silver'}
                                size="lg"
                                className="btnVote"
                                onClick={() => upvote()}
                            />
                            <FontAwesomeIcon
                                icon={faChevronCircleDown}
                                color={
                                    upvoted === false
                                        ? 'lightskyblue'
                                        : 'silver'
                                }
                                size="lg"
                                className="btnVote"
                                onClick={() => downvote()}
                            />
                        </div>
                    </div>
                    <div className="postInfo">
                        <div className="authorAndDate">
                            <small className="secondaryText author">
                                {props.data.author ? (
                                    `Posted by ${props.data.author}`
                                ) : (
                                    <Skeleton width="200px" />
                                )}
                            </small>
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
            </div>
            <div className="postContent">
                {props.data.content || <Skeleton count={7} />}
            </div>
        </div>
    );
};
