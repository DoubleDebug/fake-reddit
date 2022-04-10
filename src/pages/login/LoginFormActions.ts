import {
    getAuth,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import { validateRegisterForm } from '../../utils/dataValidation/validateRegisterForm';
import { getUserEmailByUsername } from '../../utils/firebase/getUserEmailByUsername';
import {
    registerUserWithEmail,
    registerUserWithProvider,
} from '../../utils/firebase/registerUser';
import { getErrorMessage } from '../../utils/misc/getErrorMessage';
import { displayNotif } from '../../utils/misc/toast';

export function signInWithGoogle(firstTime?: boolean) {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
        .then((userCred) => {
            const userData = {
                uid: userCred.user.uid,
                name: userCred.user.displayName,
                photoURL: userCred.user.photoURL,
            };
            if (firstTime) {
                registerUserWithProvider(
                    userData.uid,
                    userData.name,
                    userData.photoURL
                )
                    .then((res) =>
                        console.log('Successful user registration.', res)
                    )
                    .catch((err) =>
                        console.log('User registration failed.', err)
                    );
            }

            displayNotif(`Welcome to Reddit, ${userData.name}!`, 'success');
        })
        .catch((error) => {
            const message = getErrorMessage(error);
            displayNotif(message, 'error');
        });
}

export function signInWithGithub(firstTime?: boolean) {
    const auth = getAuth();
    const provider = new GithubAuthProvider();
    provider.addScope('read:user');

    signInWithPopup(auth, provider)
        .then((userCred) => {
            const userData = {
                uid: userCred.user.uid,
                name: (userCred.user as any).reloadUserInfo.screenName,
                photoURL: (userCred.user as any).reloadUserInfo.photoUrl,
            };

            if (firstTime) {
                registerUserWithProvider(
                    userData.uid,
                    userData.name,
                    userData.photoURL
                )
                    .then((res) =>
                        console.log('Successful user registration.', res)
                    )
                    .catch((err) =>
                        console.log('User registration failed.', err)
                    );
            }

            displayNotif(`Welcome to Reddit, ${userData.name}!`, 'success');
        })
        .catch((error) => {
            const message = getErrorMessage(error);
            displayNotif(message, 'error');
        });
}

export async function signInWithUsername(
    username: string,
    password: string,
    setUsernameErrorMessage: (e: string) => void,
    setPasswordErrorMessage: (e: string) => void,
    setIsLoading: (l: boolean) => void
) {
    const validation = validateRegisterForm(
        'default@email.com',
        username,
        password
    );
    if (!validation.response.success) {
        if (validation.reason === 'username')
            setUsernameErrorMessage(validation.response.message);
        if (validation.reason === 'password')
            setPasswordErrorMessage(validation.response.message);

        setIsLoading(false);
        return;
    }

    const res = await getUserEmailByUsername(username);
    if (!res.success) {
        displayNotif(res.message, 'error');
        setIsLoading(false);
        return;
    }

    const email: string = res.data;
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
        setIsLoading(false);
    }
}

export async function registerWithEmailAndPassword(
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
