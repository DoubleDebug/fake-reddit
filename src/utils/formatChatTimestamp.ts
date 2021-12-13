import { Timestamp } from 'firebase/firestore';

export function formatTimestamp(ts: Timestamp) {
    return ts.toDate().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
    });
}
