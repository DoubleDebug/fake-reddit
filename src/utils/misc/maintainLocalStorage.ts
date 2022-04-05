import { differenceInDays } from 'date-fns';

export function maintainLocalStorage() {
    const lastUpdated = localStorage.getItem('lastUpdated');
    if (!lastUpdated) {
        localStorage.setItem(
            'lastUpdated',
            JSON.stringify(new Date().toLocaleDateString('en-us'))
        );
        return;
    }

    // clear local storage that's older than 2 weeks
    const lastUpdatedDate = new Date(JSON.parse(lastUpdated));
    const dateDifference = differenceInDays(new Date(), lastUpdatedDate);
    if (dateDifference >= 14) {
        localStorage.clear();
    }
}
