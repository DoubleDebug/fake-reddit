import dayjs from 'dayjs';
import { LS } from './constants';

export function maintainLocalStorage() {
  const lastUpdated = localStorage.getItem(LS.LAST_UPDATED);
  if (!lastUpdated) {
    localStorage.setItem(
      LS.LAST_UPDATED,
      JSON.stringify(new Date().toLocaleDateString('en-us')),
    );
    return;
  }

  // clear local storage that's older than 2 weeks
  const lastUpdatedDate = new Date(JSON.parse(lastUpdated));
  const dateDifference = dayjs(lastUpdatedDate).diff(dayjs(), 'day');
  if (dateDifference >= 14) {
    localStorage.clear();
  }
}
