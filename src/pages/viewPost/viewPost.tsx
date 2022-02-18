import styles from './ViewPost.module.css';
import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
    collection,
    doc,
    DocumentReference,
    Firestore,
    getFirestore,
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
import { DB_COLLECTIONS } from '../../utils/misc/constants';
import { CommentModel } from '../../models/comment';
import { CommentSection } from '../../components/post/commentSection/CommentSection';

interface IViewPostProps {
    user: User | undefined | null;
}

export const ViewPost: React.FC<IViewPostProps> = (props) => {
    const [db] = useState<Firestore>(getFirestore());
    const { id: postId } = useParams<{ id: string }>();
    const [postData, loadingPost] = useDocumentData<PostModel>(
        doc(db, DB_COLLECTIONS.POSTS, postId) as DocumentReference<PostModel>,
        {
            transform: (p) => new PostModel({ ...p, id: postId }),
        }
    );
    const [comments] = useCollectionData<CommentModel>(
        query(
            collection(db, DB_COLLECTIONS.COMMENTS),
            where('postId', '==', postId),
            orderBy('createdAt', 'desc')
        ) as Query<CommentModel>,
        {
            idField: 'id',
        }
    );

    if (!postData && !loadingPost) {
        return <Redirect to="/"></Redirect>;
    }

    return (
        <div className={styles.postContainer}>
            <Post user={props.user} data={new PostModel(postData)}></Post>
            <CommentSection
                user={props.user}
                comments={comments}
                post={postData}
            ></CommentSection>
        </div>
    );
};
