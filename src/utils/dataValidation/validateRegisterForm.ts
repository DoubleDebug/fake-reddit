export function validateRegisterForm(
    email: string,
    username: string,
    password: string
): {
    response: ResponseStatus;
    reason?: 'email' | 'username' | 'password';
} {
    // check for empty fields
    if (email === '')
        return {
            response: {
                success: false,
                message: 'The email address cannot be empty.',
            },
            reason: 'email',
        };

    if (username === '')
        return {
            response: {
                success: false,
                message: 'The username cannot be empty.',
            },
            reason: 'username',
        };

    if (password === '')
        return {
            response: {
                success: false,
                message: 'The password cannot be empty.',
            },
            reason: 'password',
        };

    // check for email format - anything@anything.anything
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return {
            response: {
                success: false,
                message: 'The email address is invalid.',
            },
            reason: 'email',
        };

    // check for username format
    // length must be from 3 to 20      -   (?=.{3,20}$)
    // cannot start with a dot          -   (?!\.)
    // cannot have 2 consecutive dots   -   (?!.*?\.\.)
    // can have following characters    -   [a-zA-Z0-9._]
    // cannot end in a dot              -   (?<![.])
    if (!/^(?=.{3,20}$)(?!\.)(?!.*?\.\.)[a-zA-Z0-9._]+(?<![.])$/.test(username))
        return {
            response: {
                success: false,
                message: 'The username is invalid.',
            },
            reason: 'username',
        };

    // check for password format
    // length must be from 5 to 20      -   (?=.{5,20}$)
    // can have following characters    -   [a-zA-Z0-9._ ]
    if (!/^(?=.{5,20}$)[a-zA-Z0-9._ ]+$/.test(password))
        return {
            response: {
                success: false,
                message: 'The password is invalid.',
            },
            reason: 'password',
        };

    return {
        response: {
            success: true,
        },
    };
}
