import { FirebaseError } from 'firebase/app';
import { CUSTOM_ERROR_MESSAGES } from './constants';

export function getErrorMessage(error: FirebaseError) {
    const messages = CUSTOM_ERROR_MESSAGES.filter((m) => m.code === error.code);
    if (messages.length === 0) return error.message;
    return messages[0].message;
}
