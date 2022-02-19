import styles from './Feed.module.css';
import { doc, DocumentReference, getFirestore } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { Post } from '../post/Post';
import { PostModel } from '../../models/post';
import { DB_COLLECTIONS, POSTS_PER_PAGE } from '../../utils/misc/constants';
import { getPosts } from '../../utils/firebase/getPosts';
import { reachedLastDocument } from '../../utils/firebase/reachedLastDocument';
import { generatePostSkeletons } from '../post/commentSection/skeletons/GenerateSkeletons';
import { Link, useRouteMatch } from 'react-router-dom';

interface IFeedProps {
    subreddit?: string;
}

export const Feed: React.FC<IFeedProps> = (props) => {
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [offset, setOffset] = useState(0);
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
    const { url } = useRouteMatch();

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
            <div className={styles.noPosts}>
                <h2>Nothing to see here.</h2>
                <p>Be the first to post in this subreddit.</p>
                <Link
                    className={styles.btnNoPostsSubmit}
                    to={
                        url.includes('/r/')
                            ? `${url}/newPost`
                            : '/r/all/newPost'
                    }
                >
                    <button className="btn">Add a post</button>
                </Link>
            </div>
        );
    }
    return (
        <div className={styles.feed}>
            <div className={styles.postsContainer}>
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
