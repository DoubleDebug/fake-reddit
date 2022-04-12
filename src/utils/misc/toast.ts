import toast from 'react-hot-toast';
import { Renderable } from 'react-hot-toast/dist/core/types';

export function displayNotif(
    message: string,
    type: 'success' | 'error' | 'loading',
    preventDuplicates?: boolean
) {
    if (preventDuplicates) {
        toast[type](message, {
            position: 'bottom-center',
            style: {
                textAlign: 'center',
            },
            id: 'uniqueToastNotification',
        });
        return;
    }

    toast[type](message, {
        position: 'bottom-center',
        style: {
            textAlign: 'center',
        },
        duration: message.length >= 40 ? 6000 : 4000,
    });
}

export function displayNotifJSX(content: () => Renderable) {
    toast(content, {
        position: 'bottom-center',
        style: {
            maxWidth: 'initial',
            width: 'auto',
        },
    });
}
