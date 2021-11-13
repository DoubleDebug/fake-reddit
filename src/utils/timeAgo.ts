import { formatDistance } from "date-fns";

export function timeAgo(date: Date) {
    return formatDistance(date, new Date()) + ' ago';
}