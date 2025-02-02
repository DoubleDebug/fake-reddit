import { FC, useEffect } from 'react';
import { Route } from '../../routes/r.$id';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { ISubreddit } from '../../models/subreddit';
import { doc, DocumentReference, getFirestore } from 'firebase/firestore';
import { DB_COLLECTIONS } from '../../utils/misc/constants';
import { Navigate } from '@tanstack/react-router';
import { SubredditFeed } from './SubredditFeed';

export const SubredditPage: FC = () => {
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

  if (subredditId.endsWith('/new-post')) {
    return <Navigate to="/new-post" />;
  }

  if ((!loadingData && !data) || subredditId === '') {
    return <Navigate to="/" />;
  }

  return <SubredditFeed subredditId={subredditId} data={data} />;
};
