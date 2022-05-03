import { ISubreddit } from '../../models/subreddit';
import {
    validateFlair,
    validateSubreddit,
} from '../../utils/dataValidation/validateSubreddit';
import { displayNotif } from '../../utils/misc/toast';
import { submitSubreddit as firestoreSubmitSubreddit } from '../../utils/firebase/submitSubreddit';
import { User } from 'firebase/auth';

export function addFlair(
    value: string,
    setFlairError: (f: string) => void,
    subreddit: ISubreddit,
    setSubreddit: (s: ISubreddit) => void
) {
    const validation = validateFlair(value, subreddit.flairs || []);
    if (!validation.success) {
        setFlairError(validation.message);
        return false;
    }

    setSubreddit({
        ...subreddit,
        flairs: [...(subreddit.flairs || []), value.toLowerCase()],
    });
    return true;
}

export async function submitSubreddit(
    user: User | null | undefined,
    data: ISubreddit,
    setIsSubmitting: (s: boolean) => void,
    callback: () => void
) {
    // data validation
    const validation = validateSubreddit(data);
    if (!validation.success) {
        displayNotif(validation.message, 'error');
        return;
    }

    // upload to db
    setIsSubmitting(true);
    const serverResponse = await firestoreSubmitSubreddit(user, data).catch(
        (error) => {
            displayNotif(error.message, 'error');
            setIsSubmitting(false);
        }
    );
    if (serverResponse) {
        if (serverResponse.success) {
            callback();
            setIsSubmitting(false);
        } else {
            displayNotif(serverResponse.message, 'error');
            setIsSubmitting(false);
        }
    }
}
