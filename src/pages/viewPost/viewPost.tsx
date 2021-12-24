import styles from './viewPost.module.css';
import React from 'react';
import { User } from 'firebase/auth';
import { doc, Firestore } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { Post } from '../../components/post/Post';
import { PostModel } from '../../models/post';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { DB_COLLECTIONS } from '../../utils/constants';

interface IViewPostProps {
    user: User | undefined | null;
    firestore: Firestore;
}

export const ViewPost: React.FC<IViewPostProps> = (props) => {
    const { id: postId } = useParams<{ id: string }>();
    const [postData] = useDocumentData(
        doc(props.firestore, DB_COLLECTIONS.POSTS, postId)
    );

    return (
        <div className={styles.postsContainer}>
            <Post
                firestore={props.firestore}
                user={props.user}
                data={new PostModel({ ...(postData as any), id: postId })}
            ></Post>
        </div>
    );
};
