import css from '../Feed.module.css';
import { useState, useEffect, useContext } from 'react';
import { PostModel } from '../../../models/post';
import { IFeedState } from '../../../pages/home/Home';
import { SCROLL_TOP_MAX_VAL } from '../../../utils/misc/constants';
import { generatePostSkeletons } from '../../post/comments/commentSection/skeletons/GenerateSkeletons';
import { Post } from '../../post/Post';
import { filterPosts, handleBackToTopEvent } from '../FeedActions';
import useScrollPosition from '@react-hook/window-scroll';
import { UserContext } from '../../../context/UserContext';
import { getSavedPosts } from '../../../utils/firebase/getSavedPosts';

interface ISavedPostFeedProps {
    initState: IFeedState | undefined;
    saveStateCallback: (s: IFeedState) => void;
}

export const SavedPostFeed: React.FC<ISavedPostFeedProps> = (props) => {
    const user = useContext(UserContext);
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [stateWasLoaded, setStateWasLoaded] = useState(false);
    const windowScrollY = useScrollPosition(10);

    useEffect(() => {
        // avoid saving state when posts have skeletons
        if (posts.filter((p) => !p.id).length > 0) return;

        // save state
        props.saveStateCallback({
            offset: -1,
            totalNumOfPosts: -1,
            posts: filterPosts(posts),
        });
        // eslint-disable-next-line
    }, [posts]);

    useEffect(() => {
        // load previous state
        if (!stateWasLoaded && props.initState) {
            setPosts(filterPosts(props.initState.posts || []));
            setStateWasLoaded(true);
            setLoadingPosts(false);
            return;
        }

        // fetch posts from server
        setPosts([...posts, ...generatePostSkeletons()]);
        getSavedPosts(user).then((postsData) => {
            // remove skeletons and add new data
            setPosts(filterPosts([...posts, ...postsData]));
            setLoadingPosts(false);
        });

        // eslint-disable-next-line
    }, []);

    if (posts.length === 0 && !loadingPosts) {
        return (
            <div className={css.noPosts} style={{ marginTop: '0' }}>
                <h2>Nothing to see here.</h2>
                <p>You haven't saved any posts yet.</p>
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
                        <Post
                            data={p}
                            isPreview={true}
                            unsaveCallback={() =>
                                setPosts(
                                    posts.filter((post) => post.id !== p.id)
                                )
                            }
                            hideContent
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
