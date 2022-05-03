import {
    MIN_ACCOUNT_AGE,
    MIN_POSITIVE_KARMA,
} from '../../utils/misc/constants';
import { daysAgo } from '../misc/timeAgo';

export function validateSubredditCreationEligibility(
    userData: IUserData
): ResponseStatus {
    if (userData.karma < MIN_POSITIVE_KARMA) {
        return {
            success: false,
            message: `You must have at least ${MIN_POSITIVE_KARMA} positive karma.`,
        };
    }

    if (daysAgo(new Date(), userData.cakeDay.toDate()) <= MIN_ACCOUNT_AGE) {
        return {
            success: false,
            message: `Your account must be at least ${MIN_ACCOUNT_AGE} days old.`,
        };
    }

    return { success: true };
}
