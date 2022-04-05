import styles from './Conversations.module.css';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { getSecondUser } from '../../../utils/misc/whichUserUtils';
import {
    fetchPhotoURLs,
    findPhotoURL,
    formatMessage,
} from './ConversationsActions';
import Skeleton from 'react-loading-skeleton';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';

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
        const conversationSkeletons = Array(3).fill(
            <div
                className={styles.conversation}
                style={{ paddingLeft: '1rem' }}
            >
                <Skeleton width={40} height={40} circle />
                <div className={styles.nameSkeleton}>
                    <Skeleton width={110} height={15} />
                    <Skeleton width={180} height={15} />
                </div>
            </div>
        );

        return (
            <div className={styles.conversations}>{conversationSkeletons}</div>
        );
    }

    return (
        <div className={styles.conversations}>
            {props.rooms?.map((r: IChatRoom) => {
                const isSelected = r.id === props.selectedRoom;
                const secondUid = getSecondUser(props.user.uid, r.userIds);
                const secondIndex = secondUid
                    ? r.userIds.indexOf(secondUid)
                    : 0;
                const secondUser = {
                    uid: secondUid,
                    url: findPhotoURL(photoURLs, secondUid),
                    name: r.userNames[secondIndex],
                };
                return (
                    <div
                        key={r.id}
                        className={`${styles.conversation} ${
                            isSelected ? styles.selected : ''
                        }`}
                        onClick={() => props.handleRoomChange(r.id)}
                    >
                        <img
                            src={secondUser.url}
                            alt={secondUser.name}
                            className={styles.photo}
                        />
                        <div className="grid">
                            <p className={styles.name}>{secondUser.name}</p>
                            <small className={styles.lastMessage}>
                                {formatMessage(r)}
                            </small>
                        </div>
                    </div>
                );
            })}
            {props.children}
        </div>
    );
};
