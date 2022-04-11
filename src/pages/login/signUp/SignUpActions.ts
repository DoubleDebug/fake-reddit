import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
    validateEmail,
    validatePassword,
    validateUsername,
} from '../../../utils/dataValidation/validateRegisterForm';
import { registerUserWithEmail } from '../../../utils/firebase/registerUser';
import { getErrorMessage } from '../../../utils/misc/getErrorMessage';
import { displayNotif } from '../../../utils/misc/toast';

export async function signUpWithEmail(
    email: string,
    username: string,
    password: string,
    setUsernameErrorMessage: (s: string) => void,
    setPasswordErrorMessage: (s: string) => void,
    setEmailErrorMessage: (s: string) => void,
    setIsLoading: (l: boolean) => void
) {
    const validationEmail = validateEmail(email);
    const validationUsername = validateUsername(username);
    const validationPassword = validatePassword(password);
    if (
        !validationEmail.isValid ||
        !validationUsername.isValid ||
        !validationPassword.isValid
    ) {
        !validationEmail.isValid &&
            setEmailErrorMessage(validationEmail.message);
        !validationUsername.isValid &&
            setUsernameErrorMessage(validationUsername.message);
        !validationPassword.isValid &&
            setPasswordErrorMessage(validationPassword.message);

        setIsLoading(false);
        return;
    }

    const response = await registerUserWithEmail(email, username, password);
    if (response.success) {
        const auth = getAuth();
        const userCred = await signInWithEmailAndPassword(
            auth,
            email,
            password
        ).catch((err) => {
            displayNotif(getErrorMessage(err), 'error');
            setIsLoading(false);
        });

        if (userCred) {
            displayNotif(
                `Welcome to Reddit, ${userCred.user.displayName}!`,
                'success'
            );
        }
    } else {
        displayNotif(response.message, 'error');
    }

    setIsLoading(false);
}
