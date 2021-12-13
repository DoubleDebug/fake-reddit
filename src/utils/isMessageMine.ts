import { User } from 'firebase/auth';
import { IMessage } from '../pages/chat/Chat';

/**
 * @returns true if the message was sent by the logged in user
 */
export function isMessageMine(msg: IMessage, me: User): boolean {
    return msg.from.id === me.uid;
}

/**
 * @returns name of CSS class which corresponds to the user who sent the message
 */
export function isMessageMineClass(msg: IMessage, me: User): string {
    if (isMessageMine(msg, me)) return 'user1';
    else return 'user2';
}
