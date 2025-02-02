import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export function timeAgo(date: Date) {
  if (!date) return '';
  return dayjs(date).toNow();
}

export function daysAgo(date1: Date, date2: Date): number {
  const day = 1000 * 60 * 60 * 24; // in miliseconds
  return (date1.getTime() - date2.getTime()) / day;
}
