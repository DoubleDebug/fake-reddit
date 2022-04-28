import { User } from 'firebase/auth';
import {
    collection,
    getDocs,
    getFirestore,
    query,
    where,
} from 'firebase/firestore';
import { DB_COLLECTIONS } from '../../../utils/misc/constants';
import { createChatRoom } from '../../inbox/chat/ChatActions';

export async function getUserData(
    username: string
): Promise<IUserDataWithId | undefined> {
    const db = getFirestore();
    const q = query(
        collection(db, DB_COLLECTIONS.USERS),
        where('username', '==', username)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;

    return {
        ...snapshot.docs[0].data(),
        id: snapshot.docs[0].id,
    } as any;
}

export async function openChatRoom(
    user: User | undefined | null,
    data: IUserDataWithId | undefined,
    setRedirect: (r: string) => void
) {
    if (!user || !data) return;
    const room = await createChatRoom(
        {
            id: user.uid,
            name: user.displayName || '',
        },
        {
            id: data.id,
            name: data.username,
        }
    );

    setRedirect(`/inbox/${room.id}`);
}
