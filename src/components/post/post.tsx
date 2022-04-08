import 'react-loading-skeleton/dist/skeleton.css';
import css from './Post.module.css';
import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { timeAgo } from '../../utils/misc/timeAgo';
import { PostModel } from '../../models/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronCircleDown,
    faChevronCircleUp,
    faEllipsisH,
    faFlag,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect } from 'react-router-dom';
import { deletePost, downvote, openChatRoom, upvote } from './PostActions';
import { PostContent } from './PostContent';
import { UserContext } from '../../context/UserContext';
import { Dropdown } from '../../utils/dropdown/Dropdown';
import { ReportModal } from '../modals/reportModal/ReportModal';

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
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

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

    if (redirectChatId) return <Redirect to={`/inbox/${redirectChatId}`} />;
    if (deleted) return null;
    return (
        <>
            {showReportModal && (
                <ReportModal
                    type="post"
                    contentId={props.data.id || ''}
                    showStateHandler={setShowReportModal}
                />
            )}
            <div className={`contentBox ${css.container}`}>
                <div className={css.postHeader}>
                    <div className={css.postVoting}>
                        <h2 className={css.score}>{score}</h2>
                        <div className={css.arrows}>
                            <FontAwesomeIcon
                                icon={faChevronCircleUp}
                                color={upvoted ? 'darkorange' : 'silver'}
                                size="lg"
                                className={'btn ' + css.btnVote}
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
                                    upvoted === false
                                        ? 'lightskyblue'
                                        : 'silver'
                                }
                                size="lg"
                                className={'btn ' + css.btnVote}
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
                    <div className={css.postBody}>
                        <div className={css.authorAndDate}>
                            {props.data.id && (
                                <Link to={`/r/${props.data.subreddit}`}>
                                    <strong
                                        className={css.subreddit}
                                    >{`r/${props.data.subreddit}`}</strong>
                                </Link>
                            )}
                            <div className={css.secondaryText}>
                                {props.data.author ? (
                                    <div className="flex">
                                        <small>Posted by </small>
                                        <small
                                            onClick={
                                                user?.uid ===
                                                props.data.authorId
                                                    ? undefined
                                                    : () =>
                                                          openChatRoom(
                                                              user,
                                                              {
                                                                  id: props.data
                                                                      .authorId!,
                                                                  name: props
                                                                      .data
                                                                      .author,
                                                              },
                                                              setRedirectChatId
                                                          )
                                            }
                                            className={css.author}
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
                                        css.secondaryText + ' ' + css.timeAgo
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
                                    className={css.title}
                                    to={`/post/${props.data.id}`}
                                >
                                    {props.data.title}
                                </Link>
                            ) : (
                                <div className="grid">
                                    <p className={css.title}>
                                        {props.data.title}
                                    </p>
                                    <div className={css.flairsContainer}>
                                        {!props.isPreview &&
                                            props.data.flairs?.map(
                                                (f, index) => (
                                                    <small
                                                        key={`flair${index}`}
                                                        className={css.flair}
                                                    >{`#${f}`}</small>
                                                )
                                            )}
                                    </div>
                                </div>
                            )
                        ) : (
                            <Skeleton width="400px" height="30px" />
                        )}
                    </div>
                </div>

                {user ? (
                    props.data.authorId === user.uid ? (
                        <FontAwesomeIcon
                            className={'btn ' + css.btnDelete}
                            icon={faTrash}
                            color="silver"
                            title="Delete post"
                            onClick={() =>
                                deletePost(user, props.data, setDeleted)
                            }
                        />
                    ) : !props.isPreview && props.data.authorId !== user.uid ? (
                        <Dropdown
                            items={[
                                {
                                    text: 'Report post',
                                    action: () => {
                                        setShowReportModal(true);
                                        setShowOptionsDropdown(false);
                                    },
                                    icon: faFlag,
                                },
                            ]}
                        >
                            <FontAwesomeIcon
                                icon={faEllipsisH}
                                color="silver"
                                className={css.btnOptions}
                                onClick={() =>
                                    setShowOptionsDropdown(!showOptionsDropdown)
                                }
                            />
                        </Dropdown>
                    ) : null
                ) : (
                    <div></div>
                )}
                {props.isPreview ? (
                    <Link
                        className={`${css.linkToPost} ${css.isPreview}`}
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
        </>
    );
};
