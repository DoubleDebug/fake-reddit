import css from './PostHit.module.css';
import { Link } from '@tanstack/react-router';
import { logEvent, getAnalytics } from 'firebase/analytics';
import { ANALYTICS_EVENTS } from '../../../../utils/misc/constants';

export const SubredditHit: React.FC<SubredditHit> = (data) => {
  return (
    <Link to={`/r/$id`} params={{ id: data.id }} className={css.link}>
      <article
        className={css.box}
        onClick={() => {
          logEvent(getAnalytics(), ANALYTICS_EVENTS.SEARCH);
        }}
      >
        <div className={css.header}>
          <small className={css.subreddit}>{`r/${data.id}`}</small>
          <small className={css.hitType}>[subreddit]</small>
        </div>
        <p className={css.title}>{data.description}</p>
      </article>
    </Link>
  );
};
