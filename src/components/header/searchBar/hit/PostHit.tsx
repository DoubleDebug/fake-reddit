import css from './PostHit.module.css';
import { Link } from 'react-router-dom';
import { timeAgo } from '../../../../utils/misc/timeAgo';

export const PostHit: React.FC<PostHit> = (data) => {
    return (
        <Link to={`/post/${data.id}`} className={css.link}>
            <article className={css.box}>
                <div className={css.header}>
                    <small
                        className={css.subreddit}
                    >{`r/${data.subreddit}`}</small>
                    <small className={css.author}>{`by ${
                        data.author
                    } (${timeAgo(
                        new Date(Date.parse(data.createdAt))
                    )})`}</small>
                </div>
                <p className={css.title}>{data.title}</p>
            </article>
        </Link>
    );
};
