import { User } from 'firebase/auth';
import { CommentModel } from '../../models/comment';

/**
 * @returns true if the message was sent by the logged in user
 */
export function isMessageMine(msg: IMessage, me: User): boolean {
  return msg.from.id === me.uid;
}

/**
 * @returns true if the comment was submitted by the logged in user
 */
export function isCommentMine(comment: CommentModel, me: User): boolean {
  return comment.authorId === me.uid;
}

/**
 * @returns name of CSS class which corresponds to the user who sent the message
 */
export function isMessageMineClass(msg: IMessage, me: User): string {
  if (isMessageMine(msg, me)) return 'user1';
  else return 'user2';
}

/**
 * @returns id of the user which is NOT the signed in user
 */
export function getSecondUser(
  uid: string | undefined,
  userIds: string[],
): string | undefined {
  if (!uid || !userIds || userIds.length === 0) return;
  if (userIds[0] === uid) return userIds[1];
  else return userIds[0];
}

/**
 * @returns username of the user with the provided UID (only within the chat room)
 */
export function getUsernameById(room: IChatRoom, uid: string): string {
  return room?.userNames[room.userIds.findIndex((id: string) => id === uid)];
}
