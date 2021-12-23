import {
    query,
    collection,
    where,
    getDocs,
    addDoc,
    Timestamp,
    Firestore,
} from '@firebase/firestore';

/**
 * Returns the created room's id.
 * @param chatter1 First user
 * @param chatter2 Second user
 */
export async function createChatRoom(
    firestore: Firestore,
    chatter1: IChatter,
    chatter2: IChatter
): Promise<IChatRoom> {
    // CHECK IF ROOM ALREADY EXISTS
    let roomId = '';
    const userIds = [chatter1.id, chatter2.id];
    const userNames = [chatter1.name, chatter2.name];
    const roomQuery = query(
        collection(firestore, 'chatRooms'),
        where('userIds', 'in', [userIds, [...userIds].reverse()])
    );

    const chatRooms = await getDocs(roomQuery);

    if (chatRooms.empty) {
        // IF NOT, CREATE NEW CHAT ROOM
        const chatRoom = await addDoc(collection(firestore, 'chatRooms'), {
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
