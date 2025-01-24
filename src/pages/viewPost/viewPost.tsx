import css from './ViewPost.module.css';
import React, { useEffect, useState } from 'react';
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
import { Post } from '../../components/post/post';
import { PostModel } from '../../models/post';
import { DB_COLLECTIONS } from '../../utils/misc/constants';
import { CommentModel } from '../../models/comment';
import { CommentSection } from '../../components/post/comments/commentSection/CommentSection';
import { Navigate } from '@tanstack/react-router';
import { Route } from '../../routes/post.$id';

export const ViewPost: React.FC = () => {
  const [db] = useState<Firestore>(getFirestore());
  const { id: postId } = Route.useParams();
  const [postData, loadingPost] = useDocumentData<PostModel>(
    doc(db, DB_COLLECTIONS.POSTS, postId) as DocumentReference<PostModel>,
  );
  const [comments] = useCollectionData<CommentModel>(
    query(
      collection(db, DB_COLLECTIONS.COMMENTS),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc'),
    ) as Query<CommentModel>,
  );

  useEffect(() => {
    document.title = `${postData?.title} | Fake Reddit`;
  }, [postData]);

  if (!postData && !loadingPost) {
    return <Navigate to="/" />;
  }

  return (
    <div className={css.postContainer}>
      <Post data={new PostModel(postData)}></Post>
      <CommentSection comments={comments} post={postData}></CommentSection>
    </div>
  );
};
