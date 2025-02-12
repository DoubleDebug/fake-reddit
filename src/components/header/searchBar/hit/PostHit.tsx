import css from './PostHit.module.css';
import { Link } from '@tanstack/react-router';
import { timeAgo } from '../../../../utils/misc/timeAgo';
import { logEvent, getAnalytics } from 'firebase/analytics';
import { ANALYTICS_EVENTS } from '../../../../utils/misc/constants';

export const PostHit: React.FC<PostHit> = (data) => {
  return (
    <Link to={`/post/$id`} params={{ id: data.id }} className={css.link}>
      <article
        className={css.box}
        onClick={() => {
          logEvent(getAnalytics(), ANALYTICS_EVENTS.SEARCH);
        }}
      >
        <div className={css.header}>
          <small className={css.subreddit}>{`r/${data.subreddit}`}</small>
          <small className={css.author}>{`by ${data.author} (${timeAgo(
            new Date(Date.parse(data.createdAt)),
          )})`}</small>
          <small className={css.hitType}>[post]</small>
        </div>
        <p className={css.title}>{data.title}</p>
      </article>
    </Link>
  );
};
