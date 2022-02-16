import { PostModel } from '../../models/post';

export function validatePostData(data: PostModel): ResponseStatus {
    // TITLE
    if (!data.title || data.title === '' || /^\s+$/.test(data.title))
        return {
            success: false,
            message: 'Post title cannot be empty.',
        };

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
