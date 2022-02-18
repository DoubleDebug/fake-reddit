import { PostModel } from '../../models/post';

const RESTRICTIONS = {
    TITLE_LENGTH: 127,
};

export function validatePostData(data: PostModel): ResponseStatus {
    // TITLE
    if (!data.title || data.title === '' || /^\s+$/.test(data.title))
        return {
            success: false,
            message: 'Post title cannot be empty.',
        };
    if (data.title.length > RESTRICTIONS.TITLE_LENGTH) {
        return {
            success: false,
            message: `Post title cannot be longer than ${RESTRICTIONS.TITLE_LENGTH} characters.`,
        };
    }

    // POLL OPTIONS
    if (data.pollData?.options.includes(''))
        return {
            success: false,
            message: 'Poll cannot contain empty options.',
        };

    return {
        success: true,
    };
}
