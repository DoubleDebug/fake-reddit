import styles from './ViewPost.module.css';
import React from 'react';
import { User } from 'firebase/auth';
import {
    collection,
    doc,
    DocumentReference,
    Firestore,
    orderBy,
    Query,
    query,
    where,
} from 'firebase/firestore';
import {
    useCollectionData,
    useDocumentData,
} from 'react-firebase-hooks/firestore';
import { Redirect, useParams } from 'react-router-dom';
import { Post } from '../../components/post/Post';
import { PostModel } from '../../models/post';
import { DB_COLLECTIONS } from '../../utils/constants';
import { CommentModel } from '../../models/comment';
import { CommentSection } from '../../components/commentSection/CommentSection';

interface IViewPostProps {
    user: User | undefined | null;
    firestore: Firestore;
}

export const ViewPost: React.FC<IViewPostProps> = (props) => {
    const { id: postId } = useParams<{ id: string }>();
    const [postData, loadingPost] = useDocumentData<PostModel>(
        doc(
            props.firestore,
            DB_COLLECTIONS.POSTS,
            postId
        ) as DocumentReference<PostModel>,
        {
            transform: (p) => new PostModel({ ...p, id: postId }),
        }
    );
    const [comments] = useCollectionData<CommentModel>(
        query(
            collection(props.firestore, DB_COLLECTIONS.COMMENTS),
            where('postId', '==', postId),
            orderBy('createdAt', 'desc')
        ) as Query<CommentModel>,
        {
            idField: 'id',
        }
    );

    if (!postData && !loadingPost) return <Redirect to="/"></Redirect>;
    return (
        <div className={styles.postContainer}>
            <Post
                firestore={props.firestore}
                user={props.user}
                data={new PostModel(postData)}
            ></Post>
            <CommentSection
                firestore={props.firestore}
                user={props.user}
                comments={comments}
                post={postData}
            ></CommentSection>
        </div>
    );
};
