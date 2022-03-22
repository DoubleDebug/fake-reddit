import { Link } from 'react-router-dom';
import { timeAgo } from '../../../../utils/misc/timeAgo';
import styles from './Hit.module.css';

export const Hit: React.FC<PostHit> = (data) => {
    return (
        <Link to={`/post/${data.id}`} className={styles.link}>
            <article className={styles.box}>
                <div className={styles.header}>
                    <small
                        className={styles.subreddit}
                    >{`r/${data.subreddit}`}</small>
                    <small className={styles.author}>{`by ${
                        data.author
                    } (${timeAgo(
                        new Date(Date.parse(data.createdAt))
                    )})`}</small>
                </div>
                <p className={styles.title}>{data.title}</p>
            </article>
        </Link>
    );
};
