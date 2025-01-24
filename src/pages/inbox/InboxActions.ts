import { User } from 'firebase/auth';
import { DB_COLLECTIONS } from '../../utils/misc/constants';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';

export function getSelectedRoom(rooms: IChatRoom[], selectedRoom: string) {
  return rooms.filter((r) => r.id === selectedRoom)[0];
}

export function removeUnreadMessages(
  me: User | null | undefined,
  room?: IChatRoom,
) {
  if (!room || !me) return;

  const myIndex = room.userIds.indexOf(me.uid);
  const unreadCount = room.unreadMessagesCount;
  unreadCount[myIndex] = 0;
  updateDoc(doc(getFirestore(), DB_COLLECTIONS.CHAT_ROOMS, room.id), {
    unreadMessagesCount: unreadCount,
  });
}
