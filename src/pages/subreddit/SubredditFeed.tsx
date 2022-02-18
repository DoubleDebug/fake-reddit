import styles from './Subreddit.module.css';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { Feed } from '../../components/feed/Feed';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { ISubreddit } from '../../models/subreddit';
import { User } from 'firebase/auth';

interface ISubredditFeedProps {
    user: User | null | undefined;
    data: Data<ISubreddit, '', ''> | undefined;
    url: string;
    subredditId: string | undefined;
}

export const SubredditFeed: React.FC<ISubredditFeedProps> = (props) => {
    return (
        <div className="grid">
            <div className={`contentBox ${styles.container}`}>
                <div className={styles.imageAndTitle}>
                    {props.data ? (
                        <img
                            className={`${styles.image} ${
                                props.data.photoURL ? '' : styles.imageDefault
                            }`}
                            src={props.data.photoURL}
                            alt="Subreddit"
                        ></img>
                    ) : (
                        <Skeleton
                            circle={true}
                            width="100px"
                            height="100px"
                        ></Skeleton>
                    )}
                    <div className="grid" style={{ marginLeft: '1rem' }}>
                        <div className="flex">
                            <h1 className={styles.title}>
                                {props.data ? (
                                    props.data.id
                                ) : (
                                    <Skeleton width="200px"></Skeleton>
                                )}
                            </h1>
                        </div>
                        <p className={styles.path}>
                            {props.data ? (
                                `r/${props.data?.id}`
                            ) : (
                                <Skeleton width="100px"></Skeleton>
                            )}
                        </p>
                    </div>
                    <Link
                        to={`${props.url}/newPost`}
                        className={styles.btnAddPost}
                        title="Add a new post"
                    >
                        <button className="btn">
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                        </button>
                    </Link>
                </div>

                {props.data ? (
                    <p className={styles.description}>
                        {props.data.description}
                    </p>
                ) : (
                    <Skeleton
                        count={2}
                        style={{ marginTop: '0.5rem' }}
                    ></Skeleton>
                )}
            </div>
            <Feed user={props.user} subreddit={props.subredditId}></Feed>
        </div>
    );
};
