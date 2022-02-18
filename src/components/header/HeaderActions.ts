import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';

export function signInWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
        console.error(error);
    });
}

export function signOutUser() {
    const auth = getAuth();
    signOut(auth);
}
