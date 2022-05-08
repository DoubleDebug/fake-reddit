import css from '../Feed.module.css';
import { useContext, useEffect, useState } from 'react';
import { Post } from '../../post/Post';
import { PostModel } from '../../../models/post';
import {
    POSTS_PER_PAGE,
    SCROLL_TOP_MAX_VAL,
} from '../../../utils/misc/constants';
import { getPostsCustom } from '../../../utils/firebase/getPostsCustom';
import { reachedLastDocument } from '../../../utils/firebase/reachedLastDocument';
import { generatePostSkeletons } from '../../post/comments/commentSection/skeletons/GenerateSkeletons';
import {
    filterPosts,
    getTotalNumOfPosts,
    handleBackToTopEvent,
} from '../FeedActions';
import { UserContext } from '../../../context/UserContext';
import useScrollPosition from '@react-hook/window-scroll';
import { IFeedState } from '../../../pages/home/Home';
import { UserDataContext } from '../../../context/UserDataContext';

interface ICustomFeedProps {
    switchTabCallback?: () => void;
    firstLoad?: boolean;
    initState: IFeedState | undefined;
    saveStateCallback: (s: IFeedState) => void;
}

export const CustomFeed: React.FC<ICustomFeedProps> = (props) => {
    const user = useContext(UserContext);
    const userData = useContext(UserDataContext);
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [totalNumOfPosts, setTotalNumOfPosts] = useState(POSTS_PER_PAGE);
    const [offset, setOffset] = useState(0);
    const [stateWasLoaded, setStateWasLoaded] = useState(false);
    const windowScrollY = useScrollPosition(60);

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
        if (!userData) return;

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
            getPostsCustom(
                user,
                offset,
                POSTS_PER_PAGE,
                userData.hideNSFW
            ).then((postsData) => {
                // remove skeletons and add new data
                setPosts(filterPosts([...posts, ...postsData.posts]));
                setLoadingPosts(false);

                totalNumOfPosts === POSTS_PER_PAGE &&
                    getTotalNumOfPosts(postsData.followedSubreddits).then(
                        (num) => setTotalNumOfPosts(num)
                    );
            });
        }
        // eslint-disable-next-line
    }, [user, offset, userData]);

    if (posts.length === 0 && !loadingPosts) {
        return (
            <div className={css.noPosts}>
                <h2>You haven't joined any subreddits yet.</h2>
                <div className={css.noPostsParagraph}>
                    {props.switchTabCallback ? (
                        <p
                            className={css.link}
                            onClick={() => props.switchTabCallback!()}
                        >
                            Browse r/all
                        </p>
                    ) : (
                        <p style={{ marginRight: '3px' }}>Browser r/all</p>
                    )}
                    <p>and find the communities you like.</p>
                </div>
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
