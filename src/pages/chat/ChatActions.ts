import { User } from 'firebase/auth';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { DB_COLLECTIONS } from '../../utils/misc/constants';
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
} from '@firebase/firestore';

export function sendMessage(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    text: string,
    user: User | null | undefined,
    room: Data<IChatRoom, '', ''> | undefined,
    inputMessage: React.RefObject<HTMLInputElement>
) {
    e.preventDefault();
    if (!room || !user) return;

    // clear message
    if (inputMessage.current) inputMessage.current.value = '';

    // add message to db
    const db = getFirestore();
    updateDoc(doc(db, DB_COLLECTIONS.CHAT_ROOMS, room.id), {
        ...room,
        messages: room.messages.concat({
            from: {
                id: user.uid,
                name: room.userNames[0],
            },
            content: text,
            timestamp: Timestamp.now(),
        }),
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
        userIds: [chatter1.id, chatter2.id],
        userNames: [chatter1.name, chatter2.name],
    };
}