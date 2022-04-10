import { getAuth, signOut } from 'firebase/auth';

export function signOutUser() {
    const auth = getAuth();
    signOut(auth);
}
