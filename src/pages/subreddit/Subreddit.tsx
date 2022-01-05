import styles from './Subreddit.module.css';
import { User } from 'firebase/auth';
import { doc, DocumentReference, Firestore } from 'firebase/firestore';
import {
    Link,
    Route,
    Switch,
    useParams,
    useRouteMatch,
} from 'react-router-dom';
import { Feed } from '../../components/feed/Feed';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { DB_COLLECTIONS } from '../../utils/constants';
import Skeleton from 'react-loading-skeleton';
import { NewPost } from '../newPost/NewPost';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ISubreddit } from '../../models/subreddit';

interface ISubredditProps {
    user: User | null | undefined;
    firestore: Firestore;
}

export const Subreddit: React.FC<ISubredditProps> = (props) => {
    const { id: subredditId } = useParams<{ id: string }>();
    const [data] = useDocumentDataOnce<ISubreddit>(
        doc(
            props.firestore,
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
                <div className="grid">
                    <div className={`contentBox ${styles.container}`}>
                        <div className={styles.imageAndTitle}>
                            {data ? (
                                <img
                                    className={`${styles.image} ${
                                        data.photoURL ? '' : styles.imageDefault
                                    }`}
                                    src={data.photoURL}
                                    alt="Subreddit"
                                ></img>
                            ) : (
                                <Skeleton
                                    circle={true}
                                    width="100px"
                                    height="100px"
                                ></Skeleton>
                            )}
                            <div
                                className="grid"
                                style={{ marginLeft: '1rem' }}
                            >
                                <div className="flex">
                                    <h1 className={styles.title}>
                                        {data ? (
                                            data.id
                                        ) : (
                                            <Skeleton width="200px"></Skeleton>
                                        )}
                                    </h1>
                                </div>
                                <p className={styles.path}>
                                    {data ? (
                                        `r/${data?.id}`
                                    ) : (
                                        <Skeleton width="100px"></Skeleton>
                                    )}
                                </p>
                            </div>
                            <Link
                                to={`${url}/newPost`}
                                className={styles.btnAddPost}
                                title="Add a new post"
                            >
                                <button className="btn">
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                    ></FontAwesomeIcon>
                                </button>
                            </Link>
                        </div>

                        {data ? (
                            <p className={styles.description}>
                                {data.description}
                            </p>
                        ) : (
                            <Skeleton
                                count={2}
                                style={{ marginTop: '0.5rem' }}
                            ></Skeleton>
                        )}
                    </div>
                    <Feed
                        user={props.user}
                        firestore={props.firestore}
                        subreddit={subredditId}
                    ></Feed>
                </div>
            </Route>
            <Route path={`${path}/newPost`}>
                <NewPost
                    user={props.user}
                    firestore={props.firestore}
                    subreddit={subredditId}
                />
            </Route>
        </Switch>
    );
};
