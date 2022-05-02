import { Timestamp } from 'firebase/firestore';

/**
 * @returns a date string in format "15:00"
 */
export function formatTimestampTime(ts: Timestamp): string {
    return ts.toDate().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });
}

/**
 * @returns a date string in format "Dec 25, 2021, 15:00"
 */
export function formatTimestampFull(ts: Timestamp): string {
    return ts.toDate().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });
}

/**
 * @returns a date string in format "Dec 25, 2021"
 */
export function formatCakeDay(ts: Timestamp): string {
    return ts.toDate().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
