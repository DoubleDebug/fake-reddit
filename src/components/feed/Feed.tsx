import css from './Feed.module.css';
import { doc, getFirestore } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { Post } from '../post/Post';
import { PostModel } from '../../models/post';
import {
    DB_COLLECTIONS,
    POSTS_PER_PAGE,
    SCROLL_TOP_MAX_VAL,
} from '../../utils/misc/constants';
import { getPosts } from '../../utils/firebase/getPosts';
import { reachedLastDocument } from '../../utils/firebase/reachedLastDocument';
import { generatePostSkeletons } from '../post/comments/commentSection/skeletons/GenerateSkeletons';
import { Link, useRouteMatch } from 'react-router-dom';
import { handleBackToTopEvent, filterPosts } from './FeedActions';
import useScrollPosition from '@react-hook/window-scroll';
import { getDoc } from 'firebase/firestore';
import { IFeedState } from '../../pages/home/Home';

interface IFeedProps {
    subreddit?: string;
    firstLoad?: boolean;
    initState: IFeedState | undefined;
    saveStateCallback: (s: IFeedState) => void;
}

export const Feed: React.FC<IFeedProps> = (props) => {
    const { url } = useRouteMatch();
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [totalNumOfPosts, setTotalNumOfPosts] = useState(POSTS_PER_PAGE);
    const [offset, setOffset] = useState(0);
    const [stateWasLoaded, setStateWasLoaded] = useState(false);
    const windowScrollY = useScrollPosition(60);

    useEffect(() => {
        // get total num of posts
        getDoc(doc(getFirestore(), DB_COLLECTIONS.METADATA, 'numOfPosts'))
            .then((snapshot) => snapshot.data())
            .then((doc) => {
                if (!doc) return;
                setTotalNumOfPosts(
                    props.subreddit ? doc[props.subreddit] : doc.all
                );
            });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        // avoid saving state when posts have skeletons
        if (posts.filter((p) => !p.id).length > 0) return;

        // save state
        props.saveStateCallback({
            offset: offset,
            totalNumOfPosts: totalNumOfPosts,
            posts: filterPosts(posts),
        });
        // eslint-disable-next-line
    }, [posts, totalNumOfPosts]);

    useEffect(() => {
        // load previous state
        if (!props.firstLoad && !stateWasLoaded && props.initState) {
            setPosts(filterPosts(props.initState.posts || []));
            setOffset(props.initState?.offset || 0);
            setTotalNumOfPosts(
                props.initState.totalNumOfPosts || POSTS_PER_PAGE
            );
            setStateWasLoaded(true);
            setLoadingPosts(false);
            return;
        }

        // fetch posts from server
        if (
            posts.length !== totalNumOfPosts &&
            posts.length < offset + POSTS_PER_PAGE
        ) {
            // add loading skeletons
            setPosts([...posts, ...generatePostSkeletons()]);
            getPosts(offset, POSTS_PER_PAGE, props.subreddit).then(
                (postsData) => {
                    // remove skeletons and add new data
                    setPosts(filterPosts([...posts, ...postsData]));
                    setLoadingPosts(false);
                }
            );
        }
        // eslint-disable-next-line
    }, [offset]);

    if (posts.length === 0 && !loadingPosts) {
        return (
            <div className={css.noPosts}>
                <h2>Nothing to see here.</h2>
                <p>Be the first to post in this subreddit.</p>
                <Link
                    className={css.btnNoPostsSubmit}
                    to={
                        url.includes('/r/')
                            ? `${url}/newPost`
                            : '/r/all/newPost'
                    }
                >
                    <button>Add a post</button>
                </Link>
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
            <div className={css.postsContainer}>
                {posts.map((p, index: number) => (
                    <div key={index}>
                        <Post data={p} isPreview={true}></Post>
                    </div>
                ))}
            </div>
            {posts.length !== 0 &&
                !reachedLastDocument(offset, totalNumOfPosts) && (
                    <button
                        style={{ margin: '0 auto 2rem auto' }}
                        onClick={() => setOffset(offset + POSTS_PER_PAGE)}
                    >
                        Load more posts
                    </button>
                )}
        </div>
    );
};
