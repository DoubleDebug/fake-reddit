import styles from './Chat.module.css';
import {
    DocumentReference,
    Firestore,
    getFirestore,
} from '@firebase/firestore';
import { doc } from 'firebase/firestore';
import {
    useDocumentData,
    useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import {
    isMessageMine,
    isMessageMineClass,
} from '../../../utils/misc/whichUserUtils';
import {
    DB_COLLECTIONS,
    DEFAULT_PROFILE_URL,
} from '../../../utils/misc/constants';
import { timeAgo } from '../../../utils/misc/timeAgo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
import {
    getSecondUser,
    getUsernameById,
} from '../../../utils/misc/whichUserUtils';
import {
    formatTimestampFull,
    formatTimestampTime,
} from '../../../utils/misc/formatChatTimestamp';
import { getUserPhotoURL } from '../../../utils/firebase/getUserPhotoURL';
import { sendMessage } from './ChatActions';
import { UserContext } from '../../../context/UserContext';

interface IChatProps {
    roomId: string;
}

export const Chat: React.FC<IChatProps> = (props) => {
    const user = useContext(UserContext);
    const [db] = useState<Firestore>(getFirestore());
    const [room, loading] = useDocumentData<IChatRoom>(
        doc(
            db,
            DB_COLLECTIONS.CHAT_ROOMS,
            props.roomId || 'ERROR_NO_ROOM'
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
            getSecondUser(user?.uid, room?.userIds || []) || 'ERROR_NO_USER'
        ) as DocumentReference<IUserData>
    );
    const [user2PhotoURL, setUser2PhotoURL] =
        useState<string>(DEFAULT_PROFILE_URL);

    // get 2nd user's photo URL
    useEffect(() => {
        if (!user || !room) return;
        const secondUserId = getSecondUser(user.uid, room.userIds);
        if (!secondUserId) return;
        getUserPhotoURL(secondUserId).then(
            (url) => url && setUser2PhotoURL(url)
        );
    }, [user, room]);

    if (!room?.createdAt || !props.roomId) {
        return (
            <div className={styles.room}>
                <div className={styles.welcomeBox}>
                    <FontAwesomeIcon
                        icon={faCommentDots}
                        size="6x"
                        color="var(--colorOrange)"
                    />
                    <h1>Welcome to your inbox!</h1>
                    <p style={{ color: 'gray' }}>
                        Start a new conversation or revisit an old one.
                    </p>
                </div>
            </div>
        );
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
                            <h2 className={styles.username}>
                                {room &&
                                    user &&
                                    getUsernameById(
                                        room,
                                        getSecondUser(
                                            user?.uid,
                                            room?.userIds
                                        ) || ''
                                    )}
                            </h2>
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
                        if (!user) return null;
                        return (
                            <div
                                className={`flex ${
                                    isMessageMine(m, user)
                                        ? ''
                                        : styles.reversed
                                }`}
                                key={index}
                            >
                                <div
                                    className={
                                        styles.message +
                                        ' ' +
                                        styles[isMessageMineClass(m, user)]
                                    }
                                >
                                    <p className={styles.content}>
                                        {m.content}
                                    </p>
                                    <small
                                        className={styles.timestamp}
                                        title={formatTimestampFull(m.timestamp)}
                                    >
                                        {timeAgo(m.timestamp.toDate())}
                                    </small>
                                </div>
                                <div className={styles.messageAvatar}>
                                    <img
                                        className={styles.imgUsernameAvatar}
                                        src={
                                            isMessageMine(m, user)
                                                ? user.photoURL ||
                                                  DEFAULT_PROFILE_URL
                                                : user2PhotoURL
                                        }
                                        alt="User profile"
                                        title={
                                            isMessageMine(m, user)
                                                ? 'Me'
                                                : m.from.name
                                        }
                                    />
                                    <small>
                                        {formatTimestampTime(m.timestamp)}
                                    </small>
                                </div>
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
                            user,
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