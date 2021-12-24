import styles from './Home.module.css';
import {
    CollectionReference,
    doc,
    Firestore,
    limit,
    orderBy,
    query,
} from '@firebase/firestore';
import { collection } from 'firebase/firestore';
import { useState } from 'react';
import {
    useCollectionData,
    useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import { Post } from '../../components/post/Post';
import { PostModel } from '../../models/post';
import { convertToPost } from '../../utils/firebase/firebaseToDataModel';
import { User } from 'firebase/auth';
import { DB_COLLECTIONS, POSTS_PER_PAGE } from '../../utils/constants';

interface IHomeProps {
    user: User | undefined | null;
    firestore: Firestore;
}

export const Home: React.FC<IHomeProps> = (props) => {
    const [numOfAllPosts] = useDocumentDataOnce<any>(
        doc(props.firestore, DB_COLLECTIONS.METADATA, 'counters'),
        {
            transform: (c) => c.posts,
        }
    );
    const [numOfShownPosts, setNumOfShownPosts] = useState(POSTS_PER_PAGE);
    const postQuery = query<PostModel>(
        collection(
            props.firestore,
            DB_COLLECTIONS.POSTS
        ) as CollectionReference<PostModel>,
        orderBy('createdAt', 'desc'),
        limit(numOfShownPosts)
    );
    const [posts] = useCollectionData<any>(postQuery, {
        transform: (p) => convertToPost(p),
        idField: 'id',
    });
    //const posts = Array(POSTS_PER_PAGE).fill(new PostModel());

    return (
        <div className={styles.homepage}>
            <div className={styles.postsContainer}>
                {posts
                    ? posts.map((p, index: number) => {
                          return (
                              <div key={index}>
                                  <Post
                                      data={p}
                                      user={props.user}
                                      firestore={props.firestore}
                                  ></Post>
                              </div>
                          );
                      })
                    : Array(numOfShownPosts)
                          .fill(new PostModel())
                          .map((p, index: number) => (
                              <div key={index}>
                                  <Post
                                      data={p}
                                      user={props.user}
                                      firestore={props.firestore}
                                  ></Post>
                              </div>
                          ))}
            </div>
            {numOfAllPosts && numOfShownPosts < numOfAllPosts && (
                <button
                    style={{ margin: '0 auto 2rem auto' }}
                    onClick={() =>
                        setNumOfShownPosts(numOfShownPosts + POSTS_PER_PAGE)
                    }
                >
                    Load more...
                </button>
            )}
        </div>
    );
};
