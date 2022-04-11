import toast from 'react-hot-toast';
import { Renderable } from 'react-hot-toast/dist/core/types';

export function displayNotif(
    message: string,
    type: 'success' | 'error' | 'loading',
    preventDuplicates?: boolean
) {
    if (preventDuplicates) {
        toast[type](message, {
            style: {
                textAlign: 'center',
            },
            id: 'uniqueToastNotification',
        });
        return;
    }

    toast[type](message, {
        style: {
            textAlign: 'center',
            marginTop: '6rem',
        },
        duration: message.length >= 40 ? 6000 : 4000,
    });
}

export function displayNotifJSX(content: () => Renderable) {
    toast(content, {
        style: {
            maxWidth: 'initial',
            width: 'auto',
            marginTop: '6rem',
        },
    });
}
