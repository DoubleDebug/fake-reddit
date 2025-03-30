import css from '../Feed.module.css';
import customCss from './UserCommentsFeed.module.css';
import useScrollPosition from '@react-hook/window-scroll';
import { useEffect, useState } from 'react';
import { CommentModel } from '../../../models/comment';
import { IFeedState } from '../../../pages/home/Home';
import { getUserComments } from '../../../utils/firebase/getUserComments';
import {
  COMMENTS_PER_PAGE,
  SCROLL_TOP_MAX_VAL,
} from '../../../utils/misc/constants';
import { filterComments } from './UserCommentsFeedActions';
import { generateCommentSkeletons } from '../../post/comments/commentSection/skeletons/GenerateSkeletons';
import { handleBackToTopEvent } from '../FeedActions';
import { CommentPreview } from '../../post/comments/commentPreview/CommentPreview';

interface IUserCommentsFeedProps {
  username: string;
  initState: IFeedState | undefined;
  saveStateCallback: (s: IFeedState) => void;
  firstLoad?: boolean;
}

export const UserCommentsFeed: React.FC<IUserCommentsFeedProps> = (props) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [stateWasLoaded, setStateWasLoaded] = useState(false);
  const [reachedLastComment, setReachedLastComment] = useState(false);
  const windowScrollY = useScrollPosition(10);

  useEffect(() => {
    // avoid saving state when posts have skeletons
    if (comments.filter((c) => !c.id).length > 0) return;

    // save state
    props.saveStateCallback({
      offset: offset,
      totalNumOfPosts: reachedLastComment ? 1 : -1,
      posts: filterComments(comments) as any,
    });
    // eslint-disable-next-line
  }, [comments, reachedLastComment]);

  useEffect(() => {
    // load previous state
    if (!props.firstLoad && !stateWasLoaded && props.initState) {
      setComments(filterComments((props.initState.posts as any) || []));
      setOffset(props.initState?.offset || 0);
      setReachedLastComment(props.initState?.totalNumOfPosts === 1);
      setStateWasLoaded(true);
      setIsLoading(false);
      return;
    }

    if (!reachedLastComment && comments.length < offset + COMMENTS_PER_PAGE) {
      setIsLoading(true);
      // add skeletons
      setComments([...comments, ...generateCommentSkeletons()]);
      // fetch comments from server
      getUserComments(props.username, offset, COMMENTS_PER_PAGE).then(
        (commentsData) => {
          setComments(filterComments([...comments, ...commentsData]));
          setIsLoading(false);
          if (commentsData.length < COMMENTS_PER_PAGE)
            setReachedLastComment(true);
        },
      );
    }
    // eslint-disable-next-line
  }, [offset]);

  if (comments.length === 0 && !isLoading) {
    return (
      <div className={css.noPosts} style={{ marginTop: '0' }}>
        <h2>Nothing to see here.</h2>
        <p>This user hasn't commented yet.</p>
      </div>
    );
  }

  return (
    <div className={customCss.container}>
      {windowScrollY > SCROLL_TOP_MAX_VAL && (
        <button
          onClick={handleBackToTopEvent}
          type="submit"
          className={css.btnBackToTop}
        >
          Back to top
        </button>
      )}
      {comments.map((comment, index) => (
        <CommentPreview
          key={`comment${index}`}
          data={comment}
          onDelete={() =>
            setComments(comments.filter((c) => c.id !== comment.id))
          }
        />
      ))}
      {!reachedLastComment && (
        <button
          style={{ margin: '1rem auto 0 auto' }}
          onClick={() => setOffset(offset + COMMENTS_PER_PAGE)}
        >
          Load more comments
        </button>
      )}
    </div>
  );
};
