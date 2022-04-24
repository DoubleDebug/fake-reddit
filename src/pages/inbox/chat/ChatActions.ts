import { User } from 'firebase/auth';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { DB_COLLECTIONS } from '../../../utils/misc/constants';
import {
    updateDoc,
    doc,
    Timestamp,
    query,
    collection,
    where,
    getDocs,
    addDoc,
    getFirestore,
    deleteDoc,
} from '@firebase/firestore';

export function sendMessage(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    message: string,
    setMessage: (m: string) => void,
    user: User | null | undefined,
    room: Data<IChatRoom, '', ''> | undefined
) {
    e.preventDefault();
    if (!room || !user) return;

    // clear message
    setMessage('');

    // add message to db
    const db = getFirestore();
    updateDoc(doc(db, DB_COLLECTIONS.CHAT_ROOMS, room.id), {
        messages: room.messages.concat({
            from: {
                id: user.uid,
                name: user.displayName || '',
            },
            content: message,
            timestamp: Timestamp.now(),
        }),
    }).then(() => {
        // scroll to bottom
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
        });
    });

    // update unread messages
    const myIndex = room.userIds.indexOf(user.uid);
    const secondIndex = myIndex === 0 ? 1 : 0;
    const unreadCount = room.unreadMessagesCount;
    unreadCount[myIndex] = 0; // reset my unread count
    unreadCount[secondIndex] = unreadCount[secondIndex] + 1; // add 1 to other person's unread count
    updateDoc(doc(getFirestore(), DB_COLLECTIONS.CHAT_ROOMS, room.id), {
        unreadMessagesCount: unreadCount,
    });
}

/**
 * Returns the created room's id.
 * @param chatter1 First user
 * @param chatter2 Second user
 */
export async function createChatRoom(
    chatter1: IChatter,
    chatter2: IChatter
): Promise<IChatRoom> {
    // CHECK IF ROOM ALREADY EXISTS
    let roomId = '';
    const userIds = [chatter1.id, chatter2.id];
    const userNames = [chatter1.name, chatter2.name];
    const db = getFirestore();
    const roomQuery = query(
        collection(db, 'chatRooms'),
        where('userIds', 'in', [userIds, [...userIds].reverse()])
    );

    const chatRooms = await getDocs(roomQuery);

    if (chatRooms.empty) {
        // IF NOT, CREATE NEW CHAT ROOM
        const db = getFirestore();
        const chatRoom = await addDoc(collection(db, 'chatRooms'), {
            userIds: userIds,
            userNames: userNames,
            createdAt: Timestamp.now(),
            messages: [],
            unreadMessagesCount: [0, 0],
        });
        roomId = chatRoom.id;
    } else {
        // IF YES, RETURN EXISTING CHAT ROOM
        roomId = chatRooms.docs[0].id;
    }

    return {
        id: roomId,
        createdAt: Timestamp.now(),
        messages: [],
        userIds: userIds,
        userNames: userNames,
        unreadMessagesCount: [0, 0],
    };
}

export async function deleteConversation(
    room: Data<IChatRoom, '', ''> | undefined
) {
    if (!room) return;

    const db = getFirestore();
    return await deleteDoc(doc(db, DB_COLLECTIONS.CHAT_ROOMS, room.id));
}
