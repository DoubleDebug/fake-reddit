import {
    doc,
    getDoc,
    getFirestore,
    limit,
    onSnapshot,
    query,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { collection } from 'firebase/firestore';
import { Post, PostModel } from '../../components/post/post';
import './Home.css';
import { Auth } from '@firebase/auth';

const POSTS_PER_PAGE: number = 3;

export const Home: React.FC<Auth> = () => {
    const [posts, setPosts] = useState<PostModel[]>(
        Array(POSTS_PER_PAGE).fill(new PostModel())
    );
    const [numOfShownPosts, setNumOfShownPosts] = useState(POSTS_PER_PAGE);
    const [numOfAllPosts, setNumOfAllPosts] = useState(0);

    useEffect(() => {
        const db = getFirestore();
        const q = query(collection(db, 'posts'), limit(numOfShownPosts));
        onSnapshot(q, (postsData) => {
            const postsArr: PostModel[] = [];
            postsData.forEach((doc) => {
                const postData = doc.data();
                const newPost: PostModel = {
                    title: postData.title,
                    content: postData.content,
                    author: postData.author,
                    authorId: postData.authorId,
                    createdAt: postData.createdAt,
                };
                postsArr.push(newPost);
            });
            setPosts(postsArr);
        });
    }, [numOfShownPosts]);

    useEffect(() => {
        const db = getFirestore();
        getDoc(doc(db, 'metadata', 'counters')).then((metadata) => {
            const counters: any = metadata.data();
            setNumOfAllPosts(counters.posts);
        });
    }, []);

    return (
        <div style={{ display: 'grid' }}>
            <div className="postsContainer">
                {posts.map((p: PostModel, index: number) => (
                    <div key={index}>
                        <Post {...p}></Post>
                    </div>
                ))}
            </div>
            {numOfShownPosts < numOfAllPosts && (
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
