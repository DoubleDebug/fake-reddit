import css from './Feed.module.css';
import { doc, DocumentReference, getFirestore } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { Post } from '../post/Post';
import { PostModel } from '../../models/post';
import {
    DB_COLLECTIONS,
    POSTS_PER_PAGE,
    SCROLL_TOP_MAX_VAL,
} from '../../utils/misc/constants';
import { getPosts } from '../../utils/firebase/getPosts';
import { reachedLastDocument } from '../../utils/firebase/reachedLastDocument';
import { generatePostSkeletons } from '../post/commentSection/skeletons/GenerateSkeletons';
import { Link, useRouteMatch } from 'react-router-dom';
import { handleBackToTopEvent } from './FeedActions';
import useScrollPosition from '@react-hook/window-scroll';

interface IFeedProps {
    subreddit?: string;
}

export const Feed: React.FC<IFeedProps> = (props) => {
    const { url } = useRouteMatch();
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [totalNumOfPosts] = useDocumentDataOnce<number>(
        doc(
            getFirestore(),
            DB_COLLECTIONS.METADATA,
            'numOfPosts'
        ) as DocumentReference<number>,
        {
            transform: (c) => (props.subreddit ? c[props.subreddit] : c.all),
        }
    );
    const [offset, setOffset] = useState(0);
    const windowScrollY = useScrollPosition(60);

    useEffect(() => {
        // add loading skeletons
        setPosts([...posts, ...generatePostSkeletons()]);

        // fetch posts from server
        getPosts(offset, POSTS_PER_PAGE, props.subreddit).then((postsData) => {
            // remove skeletons and add new data
            setPosts([...posts, ...postsData].filter((p) => p.id));
            setLoadingPosts(false);
        });
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
