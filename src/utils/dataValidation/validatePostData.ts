import { User } from 'firebase/auth';
import { PostModel } from '../../models/post';
import { deleteFile } from '../firebase/deleteFile';
import { log } from '../misc/log';

const RESTRICTIONS = {
    TITLE_LENGTH: 127,
};

export function validatePostData(
    data: PostModel,
    user: User | undefined | null
): ResponseStatus {
    // title
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

    // poll options
    if (data.pollData?.options.includes(''))
        return {
            success: false,
            message: 'Poll cannot contain empty options.',
        };

    // delete unused content files
    if (data.type !== 'image' && data.contentFiles) {
        const filesToCleanUp = data.contentFiles.map((f) =>
            deleteFile(user, f)
        );
        Promise.all(filesToCleanUp).then((serverResponse) =>
            log(`Cleaned up unused content files: ${serverResponse}.`)
        );
    }

    // remove unnecessary fields
    if (data.type === 'text') {
        delete data.contentFiles;
        delete data.pollData;
    }
    if (data.type === 'image') {
        delete data.pollData;
    }
    if (data.type === 'poll') {
        delete data.contentFiles;
    }

    return {
        success: true,
    };
}
