import toast from 'react-hot-toast';

export function displayNotif(
    message: string,
    type: 'success' | 'error' | 'loading'
) {
    toast[type](message);
}
