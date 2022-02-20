export function validateComment(text: string): ResponseStatus {
    if (text === '') {
        return {
            success: false,
            message: 'Comment field cannot be empty.',
        };
    }

    if (text.length > 1000) {
        return {
            success: false,
            message: 'Comment field cannot contain more than 1000 characters.',
        };
    }

    return { success: true };
}
