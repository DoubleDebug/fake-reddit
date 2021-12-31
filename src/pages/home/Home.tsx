import styles from './Home.module.css';
import { doc, Firestore } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { Post } from '../../components/post/Post';
import { PostModel } from '../../models/post';
import { User } from 'firebase/auth';
import { DB_COLLECTIONS, POSTS_PER_PAGE } from '../../utils/constants';
import { getPosts } from '../../utils/firebase/getPosts';
import { reachedLastDocument } from '../../utils/firebase/reachedLastDocument';
import { generatePostSkeletons } from '../../utils/generateSkeletons';

interface IHomeProps {
    user: User | undefined | null;
    firestore: Firestore;
}

export const Home: React.FC<IHomeProps> = (props) => {
    const [totalNumOfPosts] = useDocumentDataOnce<any>(
        doc(props.firestore, DB_COLLECTIONS.METADATA, 'counters'),
        {
            transform: (c) => c.posts,
        }
    );
    const [offset, setOffset] = useState(0);
    const [posts, setPosts] = useState<PostModel[]>(generatePostSkeletons());
    // const posts = generatePostSkeletons();

    useEffect(() => {
        // add loading skeletons
        setPosts([...posts, ...generatePostSkeletons()]);

        // fetch posts from server
        getPosts(offset, POSTS_PER_PAGE).then((postsData) =>
            // remove skeletons and add new data
            setPosts([...posts, ...postsData].filter((p) => p.id))
        );
        // eslint-disable-next-line
    }, [offset]);

    return (
        <div className={styles.homepage}>
            <div className={styles.postsContainer}>
                {posts.map((p, index: number) => {
                    return (
                        <div key={index}>
                            <Post
                                data={p}
                                user={props.user}
                                firestore={props.firestore}
                            ></Post>
                        </div>
                    );
                })}
            </div>
            {!reachedLastDocument(offset, totalNumOfPosts) && (
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
