import { formatDistance } from 'date-fns';

export function timeAgo(date: Date) {
    if (!date) return '';
    return formatDistance(date, new Date()) + ' ago';
}

export function daysAgo(date1: Date, date2: Date): number {
    const day = 1000 * 60 * 60 * 24; // in miliseconds
    return (date1.getTime() - date2.getTime()) / day;
}
