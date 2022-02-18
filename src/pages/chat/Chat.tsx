import styles from './Chat.module.css';
import {
    DocumentReference,
    Firestore,
    getFirestore,
} from '@firebase/firestore';
import { doc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import {
    useDocumentData,
    useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import { useEffect, useRef, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import { isMessageMineClass } from '../../utils/misc/whichUserUtils';
import {
    DB_COLLECTIONS,
    DEFAULT_USER_AVATAR_URL,
} from '../../utils/misc/constants';
import { timeAgo } from '../../utils/misc/timeAgo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
import {
    getSecondUser,
    getUsernameById,
} from '../../utils/misc/whichUserUtils';
import { formatTimestampFull } from '../../utils/misc/formatChatTimestamp';
import { getUserPhotoURL } from '../../utils/firebase/getUserPhotoURL';
import { sendMessage } from './ChatActions';

interface IChatProps {
    user: User | undefined | null;
}

export const Chat: React.FC<IChatProps> = (props) => {
    const [db] = useState<Firestore>(getFirestore());
    const { id: roomId } = useParams<{ id: string }>();
    const [room, loading, error] = useDocumentData<IChatRoom>(
        doc(
            db,
            DB_COLLECTIONS.CHAT_ROOMS,
            roomId || 'ERROR_NO_ROOM'
        ) as DocumentReference<IChatRoom>,
        {
            idField: 'id',
        }
    );
    const inputMessage = useRef<HTMLInputElement>(null);
    const [userData] = useDocumentDataOnce<IUserData>(
        doc(
            db,
            DB_COLLECTIONS.USERS,
            getSecondUser(props.user?.uid, room?.userIds || []) ||
                'ERROR_NO_USER'
        ) as DocumentReference<IUserData>
    );
    const [user2PhotoURL, setUser2PhotoURL] = useState<string>(
        DEFAULT_USER_AVATAR_URL
    );

    // get 2nd user's photo URL
    useEffect(() => {
        if (!props.user || !room) return;
        const secondUserId = getSecondUser(props.user.uid, room.userIds);
        if (!secondUserId) return;
        getUserPhotoURL(secondUserId).then((url) => {
            if (url) setUser2PhotoURL(url);
        });
    }, [props.user, room]);

    if (error || !roomId) {
        return <Redirect to="/"></Redirect>;
    }

    return (
        <div className={styles.roomContainer}>
            <div className={styles.room}>
                <div className={styles.roomHeader}>
                    {loading ? (
                        <Skeleton
                            circle={true}
                            width="40px"
                            height="40px"
                            style={{ margin: '0.2rem 1rem 0 1rem' }}
                        ></Skeleton>
                    ) : (
                        <img
                            className={styles.imgUsernameAvatar}
                            src={user2PhotoURL}
                            alt="User profile"
                        />
                    )}
                    <div className={styles.roomUsernameContainer}>
                        {loading ? (
                            <Skeleton width="300px"></Skeleton>
                        ) : (
                            <h1 className={styles.username}>
                                {room &&
                                    props.user &&
                                    getUsernameById(
                                        room,
                                        getSecondUser(
                                            props.user?.uid,
                                            room?.userIds
                                        ) || ''
                                    )}
                            </h1>
                        )}
                        {loading ? (
                            <Skeleton width="150px"></Skeleton>
                        ) : (
                            <small className={styles.lblLastOnline}>
                                <FontAwesomeIcon
                                    icon={faCircle}
                                    color="LawnGreen"
                                    style={{ marginRight: '7px' }}
                                />
                                {timeAgo(userData?.lastOnline?.toDate())}
                            </small>
                        )}
                    </div>
                </div>
                <hr className={styles.separator} />
                {room &&
                    room.messages.map((m: IMessage, index: number) => {
                        if (!props.user) return null;
                        return (
                            <div
                                key={index}
                                className={
                                    styles.message +
                                    ' ' +
                                    styles[isMessageMineClass(m, props.user)]
                                }
                            >
                                <p className={styles.content}>{m.content}</p>
                                <small
                                    className={styles.timestamp}
                                    title={formatTimestampFull(m.timestamp)}
                                >
                                    {timeAgo(m.timestamp.toDate())}
                                </small>
                            </div>
                        );
                    })}
            </div>
            <form className={styles.formInputMessage}>
                <input
                    className={styles.inputMessage}
                    ref={inputMessage}
                    type="text"
                    placeholder="Write something"
                />
                <button
                    className="btn"
                    type="submit"
                    onClick={(e) =>
                        inputMessage.current &&
                        sendMessage(
                            e,
                            inputMessage.current.value,
                            props.user,
                            room,
                            inputMessage
                        )
                    }
                >
                    Send
                </button>
            </form>
        </div>
    );
};
