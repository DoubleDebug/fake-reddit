import { User } from 'firebase/auth';
import { doc, DocumentReference, getFirestore } from 'firebase/firestore';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { DB_COLLECTIONS } from '../../utils/misc/constants';
import { NewPost } from '../newPost/NewPost';
import { ISubreddit } from '../../models/subreddit';
import { SubredditFeed } from './SubredditFeed';

interface ISubredditProps {
    user: User | null | undefined;
}

export const Subreddit: React.FC<ISubredditProps> = (props) => {
    const { id: subredditId } = useParams<{ id: string }>();
    const [data] = useDocumentDataOnce<ISubreddit>(
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
                    user={props.user}
                    data={data}
                    url={url}
                    subredditId={subredditId}
                />
            </Route>
            <Route path={`${path}/newPost`}>
                <NewPost user={props.user} subreddit={subredditId} />
            </Route>
        </Switch>
    );
};
