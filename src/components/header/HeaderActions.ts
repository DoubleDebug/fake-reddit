import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { registerUser } from '../../utils/firebase/registerUser';

export function signInWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((userCred) => registerUser(userCred.user))
        .catch((error) => {
            console.error(error);
        });
}

export function signOutUser() {
    const auth = getAuth();
    signOut(auth);
}
