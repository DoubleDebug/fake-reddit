import css from '../Feed.module.css';
import { useState, useEffect } from 'react';
import { PostModel } from '../../../models/post';
import {
  POSTS_PER_PAGE,
  SCROLL_TOP_MAX_VAL,
} from '../../../utils/misc/constants';
import { generatePostSkeletons } from '../../post/comments/commentSection/skeletons/GenerateSkeletons';
import { Post } from '../../post/post';
import { filterPosts, handleBackToTopEvent } from '../FeedActions';
import useScrollPosition from '@react-hook/window-scroll';
import { IFeedState } from '../../../pages/home/Home';
import { getUserPosts } from '../../../utils/firebase/getUserPosts';

interface IUserPostFeedProps {
  username: string;
  initState: IFeedState | undefined;
  saveStateCallback: (s: IFeedState) => void;
  firstLoad?: boolean;
}

export const UserPostFeed: React.FC<IUserPostFeedProps> = (props) => {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [offset, setOffset] = useState(0);
  const [stateWasLoaded, setStateWasLoaded] = useState(false);
  const [reachedLastPost, setReachedLastPost] = useState(false);
  const windowScrollY = useScrollPosition(10);

  useEffect(() => {
    // avoid saving state when posts have skeletons
    if (posts.filter((p) => !p.id).length > 0) return;

    // save state
    props.saveStateCallback({
      offset: offset,
      totalNumOfPosts: reachedLastPost ? 1 : -1,
      posts: filterPosts(posts),
    });
    // eslint-disable-next-line
  }, [posts, reachedLastPost]);

  useEffect(() => {
    // load previous state
    if (!props.firstLoad && !stateWasLoaded && props.initState) {
      setPosts(filterPosts(props.initState.posts || []));
      setOffset(props.initState?.offset || 0);
      setReachedLastPost(props.initState?.totalNumOfPosts === 1);
      setStateWasLoaded(true);
      setLoadingPosts(false);
      return;
    }

    if (!reachedLastPost && posts.length < offset + POSTS_PER_PAGE) {
      setLoadingPosts(true);
      // add loading skeletons
      setPosts([...posts, ...generatePostSkeletons()]);
      // fetch posts from server
      getUserPosts(props.username, offset).then((postsData) => {
        // remove skeletons and add new data
        setPosts(filterPosts([...posts, ...postsData]));
        setLoadingPosts(false);
        if (postsData.length < POSTS_PER_PAGE) {
          setReachedLastPost(true);
        }
      });
    }
    // eslint-disable-next-line
  }, [offset]);

  if (posts.length === 0 && !loadingPosts) {
    return (
      <div className={css.noPosts} style={{ marginTop: '0' }}>
        <h2>Nothing to see here.</h2>
        <p>This user hasn't posted yet.</p>
      </div>
    );
  }
  return (
    <div className={css.feed}>
      {windowScrollY > SCROLL_TOP_MAX_VAL && (
        <button
          onClick={handleBackToTopEvent}
          type="submit"
          className={css.btnBackToTop}
        >
          Back to top
        </button>
      )}
      <div className={css.postsContainer} style={{ marginBottom: '0px' }}>
        {posts.map((p, index: number) => (
          <div key={index}>
            <Post data={p} isPreview={true} hideContent />
          </div>
        ))}
      </div>
      {posts.length !== 0 && !reachedLastPost && (
        <button
          style={{ margin: '1rem auto 2rem auto' }}
          onClick={() => setOffset(offset + POSTS_PER_PAGE)}
        >
          Load more posts
        </button>
      )}
    </div>
  );
};
