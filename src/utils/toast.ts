import toast from 'react-hot-toast';

export function displayNotif(
    message: string,
    type: 'success' | 'error' | 'loading',
    preventDuplicates?: boolean
) {
    if (preventDuplicates) {
        toast[type](message, {
            id: 'uniqueToastNotification',
        });
        return;
    }

    toast[type](message);
}
