import css from './PostHit.module.css';
import { Link } from 'react-router-dom';

export const SubredditHit: React.FC<SubredditHit> = (data) => {
    return (
        <Link to={`/r/${data.name}`} className={css.link}>
            <article className={css.box}>
                <div className={css.header}>
                    <small className={css.subreddit}>{`r/${data.name}`}</small>
                    <small className={css.hitType}>[subreddit]</small>
                </div>
                <p className={css.title}>{data.description}</p>
            </article>
        </Link>
    );
};
