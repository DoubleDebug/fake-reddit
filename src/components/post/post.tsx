import 'react-loading-skeleton/dist/skeleton.css';
import css from './Post.module.css';
import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { timeAgo } from '../../utils/misc/timeAgo';
import { PostModel } from '../../models/post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark,
  faChevronCircleDown,
  faChevronCircleUp,
  faEllipsisH,
  faFlag,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { deletePost, downvote, handleSavePost, upvote } from './PostActions';
import { PostContent } from './PostContent';
import { UserContext } from '../../context/UserContext';
import { Dropdown } from '../../utils/dropdown/Dropdown';
import { ReportModal } from '../modals/reportModal/ReportModal';
import { DeleteModal } from '../modals/deleteModal/DeleteModal';
import { UserDataContext } from '../../context/UserDataContext';
import { useIsMobile } from '../../utils/hooks/useIsMobile';
import { Link } from '@tanstack/react-router';

interface IPostProps {
  data: PostModel;
  isPreview?: boolean;
  hideContent?: true;
  unsaveCallback?: () => void;
}

export const Post: React.FC<IPostProps> = (props) => {
  const user = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const [score, setScore] = useState(props.data.getScore());
  const [upvoted, setUpvoted] = useState<boolean | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaved, setIsSaved] = useState(
    userData?.savedPosts.includes(props.data.id || '') || false,
  );
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsSaved(userData?.savedPosts.includes(props.data.id || '') || false);
  }, [userData, props.data.id]);

  useEffect(() => {
    if (user) setUpvoted(props.data.getUsersVote(user.uid));
    setScore(props.data.getScore());
  }, [user, props.data]);

  if (isDeleted) return null;
  return (
    <>
      {showReportModal && (
        <ReportModal
          type="post"
          contentId={props.data.id || ''}
          showStateHandler={setShowReportModal}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          itemBeingDeleted="post"
          showStateHandler={setShowDeleteModal}
          action={() => deletePost(user, props.data, setIsDeleted)}
          disableSuccessNotification={true}
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
                className={`iconButton ${css.btnVote}`}
                onClick={() =>
                  upvote(user, props.data, upvoted, score, setUpvoted, setScore)
                }
                title="Upvote"
              />
              <FontAwesomeIcon
                icon={faChevronCircleDown}
                color={upvoted === false ? 'lightskyblue' : 'silver'}
                size="lg"
                className={`iconButton ${css.btnVote}`}
                onClick={() =>
                  downvote(
                    user,
                    props.data,
                    upvoted,
                    score,
                    setUpvoted,
                    setScore,
                  )
                }
                title="Downvote"
              />
            </div>
          </div>
          <div className={css.postBody}>
            <div className={css.authorAndDate}>
              {props.data.id && (
                <Link
                  to={`/r/$id`}
                  params={{ id: props.data.subreddit }}
                  title={`Subreddit r/${props.data.subreddit}`}
                >
                  <strong
                    className={css.subreddit}
                  >{`r/${props.data.subreddit}`}</strong>
                </Link>
              )}
              <div className={css.secondaryText}>
                {props.data.author ? (
                  <>
                    <small>Posted by </small>
                    <Link
                      to={`/user/$username`}
                      params={{ username: props.data.author }}
                      className="linkNoUnderline"
                    >
                      <small className={css.author}>{props.data.author}</small>
                    </Link>
                  </>
                ) : (
                  <Skeleton width="200px" />
                )}
              </div>
              {!isMobile && (
                <Link
                  to={`/post/$id`}
                  params={{ id: props.data.id! }}
                  title={props.data.createdAt.toDate().toLocaleString()}
                  className={css.secondaryText + ' ' + css.timeAgo}
                >
                  <small>
                    {props.data.title && timeAgo(props.data.createdAt.toDate())}
                  </small>
                </Link>
              )}
            </div>
            {props.data.title ? (
              props.isPreview ? (
                <Link
                  className={css.title}
                  to={`/post/$id`}
                  params={{ id: props.data.id! }}
                >
                  {props.data.title}
                </Link>
              ) : (
                <div className="grid">
                  <p className={css.title}>{props.data.title}</p>
                  <div className={css.flairsContainer}>
                    {!props.isPreview &&
                      props.data.flairs?.map((f, index) => (
                        <p
                          key={`flair${index}`}
                          className={css.flair}
                        >{`#${f}`}</p>
                      ))}
                  </div>
                </div>
              )
            ) : (
              <Skeleton width="400px" height="30px" />
            )}
          </div>
          {props.unsaveCallback && (
            <FontAwesomeIcon
              className={css.btnUnsave}
              size="lg"
              icon={faBookmark}
              title="Unsave post"
              onClick={() => {
                handleSavePost(userData, props.data.id, isSaved, setIsSaved);
                if (props.unsaveCallback) props.unsaveCallback();
              }}
            />
          )}
        </div>

        {user ? (
          props.data.authorId === user.uid ? (
            <FontAwesomeIcon
              className={'iconButton ' + css.btnDelete}
              icon={faTrash}
              color="silver"
              title="Delete post"
              onClick={() => setShowDeleteModal(true)}
            />
          ) : !props.isPreview && props.data.authorId !== user.uid ? (
            <Dropdown
              style={{ zIndex: 1000 }}
              items={[
                {
                  text: isSaved ? 'Unsave' : 'Save post',
                  action: () =>
                    handleSavePost(
                      userData,
                      props.data.id,
                      isSaved,
                      setIsSaved,
                    ),
                  icon: faBookmark,
                },
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
                onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              />
            </Dropdown>
          ) : (
            <div></div>
          )
        ) : (
          <div></div>
        )}
        {!props.hideContent && (
          <PostContent data={props.data} isPreview={props.isPreview} />
        )}
      </div>
    </>
  );
};
