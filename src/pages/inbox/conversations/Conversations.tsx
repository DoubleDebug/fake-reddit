import styles from './Conversations.module.css';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from 'firebase/auth';
import {
    query,
    collection,
    getFirestore,
    where,
    Query,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { DB_COLLECTIONS } from '../../../utils/misc/constants';
import { getSecondUser } from '../../../utils/misc/whichUserUtils';
import {
    fetchPhotoURLs,
    findPhotoURL,
    formatMessage,
} from './ConversationsActions';

interface IConversationsProps {
    user: User;
    selectedRoom: string;
    handleRoomChange: (rid: string) => void;
}

export const Conversations: React.FC<IConversationsProps> = (props) => {
    const [rooms] = useCollectionData<IChatRoom>(
        query(
            collection(getFirestore(), DB_COLLECTIONS.CHAT_ROOMS),
            where('userIds', 'array-contains', props.user.uid)
        ) as Query<IChatRoom>,
        {
            idField: 'id',
        }
    );
    const [photoURLs, setPhotoURLs] = useState<
        { uid?: string; url?: string }[]
    >([]);

    // fetch user photo urls
    useEffect(() => {
        if (!rooms) return;
        fetchPhotoURLs(props.user, rooms, setPhotoURLs);
    }, [rooms, props.user]);

    if (!rooms) {
        return <FontAwesomeIcon icon={faSpinner} spin />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.conversations}>
                {rooms.map((r: IChatRoom) => {
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
            </div>
        </div>
    );
};
