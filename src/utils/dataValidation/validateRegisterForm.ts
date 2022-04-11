/**
 * Checks if the string follows the email format:
 * anything@anything.anything
 */
export function validateEmail(email: string): ValidationResult {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return {
            isValid: false,
            message: 'The email address is invalid.',
        };
    return {
        isValid: true,
    };
}

/**
 * Checks for the following rules:
 *      length must be from 3 to 20    -   (?=.{3,20}$)
 *      cannot start with a dot        -   (?!\.)
 *      cannot have 2 consecutive dots -   (?!.*?\.\.)
 *      can have following characters  -   [a-zA-Z0-9._]
 *      cannot end in a dot            -   (?<![.])
 */
export function validateUsername(username: string): ValidationResult {
    if (!/^(?=.{3,20}$)(?!\.)(?!.*?\.\.)[a-zA-Z0-9._]+(?<![.])$/.test(username))
        return {
            isValid: false,
            message: 'The username is invalid.',
        };
    return {
        isValid: true,
    };
}

/**
 * Checks for the following rules:
 *      length must be from 5 to 20    -   (?=.{5,20}$)
 *      can have following characters  -   [a-zA-Z0-9._ ]
 */
export function validatePassword(password: string): ValidationResult {
    if (!/^(?=.{5,20}$)[a-zA-Z0-9._ ]+$/.test(password))
        return {
            isValid: false,
            message: 'The password is invalid.',
        };
    return {
        isValid: true,
    };
}
