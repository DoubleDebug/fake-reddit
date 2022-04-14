import css from './Conversations.module.css';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { getSecondUser } from '../../../utils/misc/whichUserUtils';
import {
    fetchPhotoURLs,
    findPhotoURL,
    formatMessage,
} from './ConversationsActions';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { ConversationSkeletons } from './ConversationSkeletons';

interface IConversationsProps {
    user: User;
    rooms: Data<IChatRoom, '', ''>[] | undefined;
    selectedRoom: string;
    handleRoomChange: (rid: string) => void;
}

export const Conversations: React.FC<IConversationsProps> = (props) => {
    const [photoURLs, setPhotoURLs] = useState<
        { uid?: string; url?: string }[]
    >([]);

    // fetch user photo urls
    useEffect(() => {
        if (!props.rooms) return;
        fetchPhotoURLs(props.user, props.rooms, setPhotoURLs);
    }, [props.rooms, props.user]);

    if (!props.rooms) {
        return <ConversationSkeletons />;
    }

    return (
        <div className={css.conversations}>
            {props.rooms?.map((r: IChatRoom) => {
                const isSelected = r.id === props.selectedRoom;
                const secondUid = getSecondUser(props.user.uid, r.userIds);
                const firstIndex = r.userIds.indexOf(props.user.uid);
                const secondIndex = secondUid
                    ? r.userIds.indexOf(secondUid)
                    : 0;
                const secondUser = {
                    uid: secondUid,
                    url: findPhotoURL(photoURLs, secondUid),
                    name: r.userNames[secondIndex],
                };
                const unreadCount = r.unreadMessagesCount[firstIndex];
                return (
                    <div
                        key={r.id}
                        className={`${css.conversation} ${
                            isSelected ? css.selected : ''
                        }`}
                        onClick={() => props.handleRoomChange(r.id)}
                    >
                        <img
                            src={secondUser.url}
                            alt={secondUser.name}
                            className={css.photo}
                        />
                        <div className={css.nameAndLastMessage}>
                            <p
                                className={`${css.name} ${
                                    unreadCount > 0 ? css.unread : ''
                                }`}
                            >
                                {secondUser.name}
                            </p>
                            <small className={css.lastMessage}>
                                {formatMessage(props.user, r)}
                            </small>
                        </div>
                        {unreadCount > 0 && (
                            <small className={css.unreadCount}>
                                {unreadCount}
                            </small>
                        )}
                    </div>
                );
            })}
            {props.children}
        </div>
    );
};
