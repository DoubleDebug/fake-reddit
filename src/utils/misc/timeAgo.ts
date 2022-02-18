import { formatDistance } from 'date-fns';

export function timeAgo(date: Date) {
    if (!date) return '';
    return formatDistance(date, new Date()) + ' ago';
}
