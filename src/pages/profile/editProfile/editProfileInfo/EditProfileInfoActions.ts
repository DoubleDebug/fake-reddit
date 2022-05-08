import { User } from 'firebase/auth';
import {
    collection,
    doc,
    getDocs,
    getFirestore,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import {
    validateBio,
    validateUsername,
} from '../../../../utils/dataValidation/validateRegisterForm';
import { cleanObject } from '../../../../utils/misc/cleanObject';
import { DB_COLLECTIONS } from '../../../../utils/misc/constants';
import { displayNotif } from '../../../../utils/misc/toast';

export async function handleSaveChanges(
    e: React.MouseEvent,
    user: User | null | undefined,
    setIsSaving: (s: boolean) => void,
    data: {
        username: string;
        bio: string;
        hideNSFW: boolean;
    },
    setUsernameError: (e: string | undefined) => void,
    setBioError: (e: string | undefined) => void,
    setUpdatedUsername: (u: string | undefined) => void
) {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setUsernameError(undefined);
    setBioError(undefined);

    // validate input
    const v_username = validateUsername(data.username);
    if (!v_username.isValid) {
        setUsernameError(v_username.message);
        setIsSaving(false);
        return;
    }
    const v_bio = validateBio(data.bio);
    if (!v_bio.isValid) {
        setBioError(v_bio.message);
        setIsSaving(false);
        return;
    }

    // check if username already exists
    const db = getFirestore();
    const q = query(
        collection(db, DB_COLLECTIONS.USERS),
        where('username', '==', data.username)
    );
    const usersWithSameUsername = await getDocs(q);
    if (
        !usersWithSameUsername.empty &&
        usersWithSameUsername.docs[0].id !== user.uid
    ) {
        setUsernameError('This username is already taken.');
        setIsSaving(false);
        return;
    }

    // update profile
    const updatedData: any = cleanObject({
        username: data.username,
        bio: data.bio,
        hideNSFW: data.hideNSFW,
    });
    await updateDoc(doc(db, DB_COLLECTIONS.USERS, user.uid), updatedData)
        .then(() => {
            setUpdatedUsername(data.username);
        })
        .catch(() => {
            displayNotif('Failed to update profile information.', 'error');
        });

    setIsSaving(false);
}
