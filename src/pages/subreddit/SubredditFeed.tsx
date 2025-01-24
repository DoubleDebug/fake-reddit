import css from './Subreddit.module.css';
import Skeleton from 'react-loading-skeleton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Feed } from '../../components/feed/Feed';
import { ISubreddit } from '../../models/subreddit';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { followSubreddit } from './SubredditActions';
import { getSubredditLogoURL } from '../../utils/firebase/getSubredditLogoURL';
import { DEFAULT_SUBREDDIT_LOGO_URL } from '../../utils/misc/constants';
import { Link } from '@tanstack/react-router';
import { Route } from '../../routes/r.$id';

interface ISubredditFeedProps {
  subredditId: string | undefined;
  data: ISubreddit | undefined;
}

export const SubredditFeed: React.FC<ISubredditFeedProps> = (props) => {
  const user = useContext(UserContext);
  const [sortingMethod, setSortingMethod] = useState<'new' | 'top'>('new');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [logoURL, setLogoURL] = useState(DEFAULT_SUBREDDIT_LOGO_URL);

  useEffect(() => {
    if (!props.data || !user) return;
    setIsFollowing(props.data.followers.includes(user.uid));

    if (props.data.photoURL) {
      getSubredditLogoURL(props.data.photoURL).then(
        (url) => url && setLogoURL(url),
      );
    }
  }, [props.data, user]);

  return (
    <div className="grid">
      <div className={`contentBox ${css.container}`}>
        <div className={css.imageAndTitle}>
          {props.data ? (
            <img className={`${css.image}`} src={logoURL} alt="Subreddit" />
          ) : (
            <Skeleton circle={true} width="100px" height="100px" />
          )}
          <div className="grid" style={{ marginLeft: '1rem' }}>
            <div className="flex">
              <h1 className={css.title}>
                {props.data ? props.data.id : <Skeleton width="200px" />}
              </h1>
            </div>
            <p className={css.path}>
              {props.data ? `r/${props.data?.id}` : <Skeleton width="100px" />}
            </p>
          </div>
          {user ? (
            <div className="flex" style={{ marginLeft: 'auto' }}>
              {props.data?.id !== 'all' && (
                <button
                  disabled={isLoadingFollow}
                  type={isFollowing ? 'button' : 'submit'}
                  title={`${
                    isFollowing ? 'Unfollow' : 'Follow'
                  } r/${props.data?.id}`}
                  className={css.btnFollow}
                  onClick={() => {
                    if (!user) return;
                    setIsLoadingFollow(true);
                    followSubreddit(
                      props.data,
                      user.uid,
                      isFollowing ? true : undefined,
                    ).then(() => setIsLoadingFollow(false));
                  }}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
              <Link
                from={Route.fullPath}
                to="./new-post"
                className={css.btnAddPost}
                title="Add a new post"
              >
                <button>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </Link>
            </div>
          ) : (
            user === undefined && (
              <div className={css.skeletonContainer}>
                <Skeleton width={97} height={40} />
                <Skeleton width={40} height={40} />
              </div>
            )
          )}
        </div>
        {props.data ? (
          <p className={css.description}>{props.data.description}</p>
        ) : (
          <Skeleton count={2} style={{ marginTop: '0.5rem' }} />
        )}
        {props.data ? (
          <div className={css.sortingContainer}>
            <button
              disabled={isLoadingPosts}
              className={css.btnSort}
              type={sortingMethod === 'new' ? 'submit' : 'button'}
              onClick={() => {
                setSortingMethod(sortingMethod === 'new' ? 'top' : 'new');
                setIsLoadingPosts(true);
              }}
            >
              New
            </button>
            <button
              disabled={isLoadingPosts}
              className={css.btnSort}
              type={sortingMethod === 'top' ? 'submit' : 'button'}
              onClick={() => {
                setSortingMethod(sortingMethod === 'new' ? 'top' : 'new');
                setIsLoadingPosts(true);
              }}
            >
              Top
            </button>
            {props.data && (
              <p
                className={css.numOfMembers}
              >{`${props.data?.followers.length} members`}</p>
            )}
          </div>
        ) : (
          <Skeleton style={{ marginTop: '1rem' }} width={130} height={40} />
        )}
      </div>
      <Feed
        subreddit={props.subredditId}
        initState={undefined}
        saveStateCallback={() => {}}
        sortingMethod={sortingMethod}
        setLoadingPosts={(l) => setIsLoadingPosts(l)}
      />
    </div>
  );
};
