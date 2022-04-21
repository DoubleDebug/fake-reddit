import { doc, DocumentReference, getFirestore } from 'firebase/firestore';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { DB_COLLECTIONS } from '../../utils/misc/constants';
import { NewPost } from '../newPost/NewPost';
import { ISubreddit } from '../../models/subreddit';
import { SubredditFeed } from './SubredditFeed';

export const Subreddit: React.FC = () => {
    const { id: subredditId } = useParams<{ id: string }>();
    const [data] = useDocumentData<ISubreddit>(
        doc(
            getFirestore(),
            DB_COLLECTIONS.SUBREDDITS,
            subredditId
        ) as DocumentReference<ISubreddit>,
        {
            idField: 'id',
        }
    );
    const { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <SubredditFeed
                    data={data}
                    url={url}
                    subredditId={subredditId}
                />
            </Route>
            <Route path={`${path}/newPost`}>
                <NewPost subreddit={subredditId} />
            </Route>
        </Switch>
    );
};
