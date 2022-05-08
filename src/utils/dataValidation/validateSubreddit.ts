import { ISubreddit } from '../../models/subreddit';
import { COMMON_FLAIRS, SUBREDDIT_LIMITS as SL } from '../misc/constants';

export function validateSubreddit(data: ISubreddit): ResponseStatus {
    // minimum name length
    if (data.id.length < SL.MIN_NAME_LENGTH) {
        return {
            success: false,
            message: `The subreddit name is too short. Minimum length: ${SL.MIN_NAME_LENGTH} letters.`,
        };
    }

    // maximum name length
    if (data.id.length > SL.MAX_NAME_LENGTH) {
        return {
            success: false,
            message: `The subreddit name is too long. Maximum length: ${SL.MAX_NAME_LENGTH} letters.`,
        };
    }

    // flair validation
    if (data.flairs) {
        for (let i = 0; i < data.flairs.length; i++) {
            const fl = data.flairs[i];
            const validation = validateFlair(
                fl,
                data.flairs.filter((f) => f !== fl),
                true
            );
            if (!validation.success) {
                return validation;
            }
        }
    }

    // maximum description length
    if (data.description.length > SL.MAX_DESCRIPTION_LENGTH) {
        return {
            success: false,
            message: `The subreddit description is too long. Maximum length: ${SL.MAX_DESCRIPTION_LENGTH} letters.`,
        };
    }

    // maximum number of flairs
    if (data.flairs && data.flairs.length > SL.MAX_NUM_OF_FLAIRS) {
        return {
            success: false,
            message: `Maximum number of flairs is ${SL.MAX_NUM_OF_FLAIRS}.`,
        };
    }

    return {
        success: true,
    };
}

export function validateFlair(
    flair: string,
    otherFlairs: string[],
    specifyFlairOnError?: true
): ResponseStatus {
    // minimum flair length
    if (flair.length < SL.MIN_FLAIR_LENGTH) {
        return {
            success: false,
            message: `The flair ${
                specifyFlairOnError ? flair : ''
            } is too short. Minimum length: ${SL.MIN_FLAIR_LENGTH}.`,
        };
    }

    // maximum flair length
    if (flair.length > SL.MAX_FLAIR_LENGTH) {
        return {
            success: false,
            message: `The flair ${
                specifyFlairOnError ? flair : ''
            } is too long. Maximum length: ${SL.MAX_FLAIR_LENGTH}.`,
        };
    }

    // no duplicates
    // test for case insensitive existing flairs
    const regex = new RegExp([...otherFlairs, ...COMMON_FLAIRS].join('|'), 'i');
    if (regex.test(flair)) {
        return {
            success: false,
            message: `This flair ${
                specifyFlairOnError ? flair : ''
            } already exists.`,
        };
    }

    return {
        success: true,
    };
}
