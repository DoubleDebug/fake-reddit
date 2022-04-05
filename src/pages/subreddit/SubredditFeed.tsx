import css from './Subreddit.module.css';
import Skeleton from 'react-loading-skeleton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { Feed } from '../../components/feed/Feed';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { ISubreddit } from '../../models/subreddit';

interface ISubredditFeedProps {
    data: Data<ISubreddit, '', ''> | undefined;
    url: string;
    subredditId: string | undefined;
}

export const SubredditFeed: React.FC<ISubredditFeedProps> = (props) => {
    return (
        <div className="grid">
            <div className={`contentBox ${css.container}`}>
                <div className={css.imageAndTitle}>
                    {props.data ? (
                        <img
                            className={`${css.image} ${
                                props.data.photoURL ? '' : css.imageDefault
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
                            <h1 className={css.title}>
                                {props.data ? (
                                    props.data.id
                                ) : (
                                    <Skeleton width="200px"></Skeleton>
                                )}
                            </h1>
                        </div>
                        <p className={css.path}>
                            {props.data ? (
                                `r/${props.data?.id}`
                            ) : (
                                <Skeleton width="100px"></Skeleton>
                            )}
                        </p>
                    </div>
                    <Link
                        to={`${props.url}/newPost`}
                        className={css.btnAddPost}
                        title="Add a new post"
                    >
                        <button className="btn">
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                        </button>
                    </Link>
                </div>

                {props.data ? (
                    <p className={css.description}>{props.data.description}</p>
                ) : (
                    <Skeleton
                        count={2}
                        style={{ marginTop: '0.5rem' }}
                    ></Skeleton>
                )}
            </div>
            <Feed subreddit={props.subredditId}></Feed>
        </div>
    );
};
