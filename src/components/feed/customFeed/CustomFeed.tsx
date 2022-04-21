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
import { getTotalNumOfPosts, handleBackToTopEvent } from '../FeedActions';
import { UserContext } from '../../../context/UserContext';
import useScrollPosition from '@react-hook/window-scroll';

interface ICustomFeedProps {
    switchTabCallback?: () => void;
}

export const CustomFeed: React.FC<ICustomFeedProps> = (props) => {
    const user = useContext(UserContext);
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [followedSubreddits, setFollowedSubreddits] = useState<string[]>([]);
    const [totalNumOfPosts, setTotalNumOfPosts] =
        useState<number>(POSTS_PER_PAGE);
    const [offset, setOffset] = useState(0);
    const windowScrollY = useScrollPosition(60);

    useEffect(() => {
        // fetch total num of posts
        getTotalNumOfPosts(followedSubreddits).then((num) =>
            setTotalNumOfPosts(num)
        );
    }, [followedSubreddits]);

    useEffect(() => {
        // add loading skeletons
        setPosts([...posts, ...generatePostSkeletons()]);

        // fetch posts from server
        getPostsCustom(user, offset, POSTS_PER_PAGE).then((postsData) => {
            // remove skeletons and add new data
            setPosts([...posts, ...postsData.posts].filter((p) => p.id));
            setLoadingPosts(false);
            setFollowedSubreddits(postsData.followedSubreddits);
        });
        // eslint-disable-next-line
    }, [user, offset]);

    if (posts.length === 0 && !loadingPosts) {
        return (
            <div className={css.noPosts} style={{ marginTop: '10rem' }}>
                <h2>You haven't joined any subreddits yet.</h2>
                <div className="flex">
                    {props.switchTabCallback ? (
                        <button onClick={() => props.switchTabCallback!()}>
                            <p>Browse r/all</p>
                        </button>
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
                {posts.map((p, index: number) => {
                    return (
                        <div key={index}>
                            <Post data={p} isPreview={true}></Post>
                        </div>
                    );
                })}
            </div>
            {totalNumOfPosts &&
                posts.length !== 0 &&
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
