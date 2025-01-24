import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { ISubreddit } from '../models/subreddit';
import { doc, DocumentReference, getFirestore } from 'firebase/firestore';
import { DB_COLLECTIONS } from '../utils/misc/constants';
import { useEffect } from 'react';
import { NewPost } from '../pages/newPost/newPost';

export const Route = createFileRoute('/r/$id/new-post')({
  component: () => {
    const { id: subredditId } = Route.useParams();
    const [data, loadingData] = useDocumentData<ISubreddit>(
      doc(
        getFirestore(),
        DB_COLLECTIONS.SUBREDDITS,
        subredditId,
      ) as DocumentReference<ISubreddit>,
    );

    useEffect(() => {
      document.title = `r/${subredditId} | Fake Reddit`;
    }, [subredditId]);

    if ((!loadingData && !data) || subredditId === '') {
      return <Navigate to="/" />;
    }

    return <NewPost subreddit={subredditId} />;
  },
});
