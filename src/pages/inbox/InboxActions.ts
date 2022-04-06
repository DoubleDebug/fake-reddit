import { User } from 'firebase/auth';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';
import { DB_COLLECTIONS } from '../../utils/misc/constants';

export function removeUnreadMessages(
    me: User | null | undefined,
    room?: IChatRoom
) {
    if (!room || !me) return;

    const myIndex = room.userIds.indexOf(me.uid);
    const unreadCount = room.unreadMessagesCount;
    unreadCount[myIndex] = 0;
    updateDoc(doc(getFirestore(), DB_COLLECTIONS.CHAT_ROOMS, room.id), {
        unreadMessagesCount: unreadCount,
    });
}
