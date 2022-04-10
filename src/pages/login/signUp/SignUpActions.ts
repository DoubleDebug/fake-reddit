import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { validateRegisterForm } from '../../../utils/dataValidation/validateRegisterForm';
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
    const validation = validateRegisterForm(email, username, password);
    if (!validation.response.success) {
        if (validation.reason === 'email')
            setEmailErrorMessage(validation.response.message);
        if (validation.reason === 'username')
            setUsernameErrorMessage(validation.response.message);
        if (validation.reason === 'password')
            setPasswordErrorMessage(validation.response.message);
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
