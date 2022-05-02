import css from './Chat.module.css';
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
import {
    faCircle,
    faCircleNotch,
    faCommentDots,
    faEllipsisH,
    faFlag,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';
import {
    getSecondUser,
    getUsernameById,
} from '../../../utils/misc/whichUserUtils';
import {
    formatTimestampFull,
    formatTimestampTime,
} from '../../../utils/misc/formatTimestamp';
import { getUserPhotoURL } from '../../../utils/firebase/getUserPhotoURL';
import { sendMessage } from './ChatActions';
import { UserContext } from '../../../context/UserContext';
import { Separator } from '../../../utils/separator/Separator';
import { Dropdown } from '../../../utils/dropdown/Dropdown';
import { TextField } from '@mui/material';

interface IChatProps {
    roomId: string;
    setShowReportModal: (s: boolean) => void;
    setShowDeleteModal: (s: boolean) => void;
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
    const [message, setMessage] = useState('');
    const [userData] = useDocumentDataOnce<IUserData>(
        doc(
            db,
            DB_COLLECTIONS.USERS,
            getSecondUser(user?.uid, room?.userIds || []) || 'ERROR_NO_USER'
        ) as DocumentReference<IUserData>
    );
    const [user2PhotoURL, setUser2PhotoURL] =
        useState<string>(DEFAULT_PROFILE_URL);
    const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
    const refRoom = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // get 2nd user's photo URL
        if (!user || !room) return;
        const secondUserId = getSecondUser(user.uid, room.userIds);
        secondUserId &&
            getUserPhotoURL(secondUserId).then(
                (url) => url && setUser2PhotoURL(url)
            );

        // update room's CSS grid layout
        if (!refRoom.current || !room.messages) return;
        refRoom.current.style.gridTemplateRows = `60px repeat(${room.messages.length}, min-content)`;
    }, [user, room]);

    if (!props.roomId || !room?.userIds) {
        return (
            <div className={css.room} ref={refRoom}>
                <div className={css.welcomeBox}>
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
        <div className={css.roomContainer}>
            <div className={css.room} ref={refRoom}>
                <div className={css.roomHeader}>
                    {loading ? (
                        <Skeleton
                            circle={true}
                            width="40px"
                            height="40px"
                            style={{ margin: '0.2rem 1rem 0 1rem' }}
                        ></Skeleton>
                    ) : (
                        <img
                            className={css.imgUsernameAvatar}
                            src={user2PhotoURL}
                            alt="User profile"
                        />
                    )}
                    <div className={css.roomUsernameContainer}>
                        {!loading &&
                        room &&
                        room.createdAt &&
                        room.userIds &&
                        room.messages ? (
                            <h2 className={css.username}>
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
                        ) : (
                            <Skeleton width="250px" />
                        )}
                        <div className="flex">
                            <FontAwesomeIcon
                                icon={faCircle}
                                color="LawnGreen"
                                style={{ marginRight: '7px' }}
                            />
                            {userData && (
                                <small className={css.lblLastOnline}>
                                    {timeAgo(userData?.lastOnline?.toDate())}
                                </small>
                            )}
                        </div>
                    </div>
                    <Dropdown
                        style={{ marginLeft: 'auto' }}
                        items={[
                            {
                                text: 'Report user',
                                action: () => {
                                    props.setShowReportModal(true);
                                    setShowOptionsDropdown(false);
                                },
                                icon: faFlag,
                            },
                            {
                                text: 'Delete conversation',
                                action: () => {
                                    props.setShowDeleteModal(true);
                                    setShowOptionsDropdown(false);
                                },
                                icon: faTrash,
                            },
                        ]}
                    >
                        <FontAwesomeIcon
                            icon={faEllipsisH}
                            className={css.iconThreeDots}
                            onClick={() =>
                                setShowOptionsDropdown(!showOptionsDropdown)
                            }
                        />
                    </Dropdown>
                </div>
                <hr className={css.separator} />
                {room && room.messages && !loading ? (
                    room.messages.map((m: IMessage, index: number) => {
                        if (!user) return null;
                        const myIndex = room.userIds.indexOf(user.uid);
                        const myUnread = room.unreadMessagesCount[myIndex];
                        const isUnread =
                            room.messages.length - myUnread - 1 === index;
                        const displaySeparator = isUnread && myUnread > 0;
                        const secondUser = getUsernameById(
                            room,
                            getSecondUser(user?.uid, room?.userIds || []) || ''
                        );

                        return (
                            <div key={`message${index}`}>
                                <div
                                    className={`flex ${
                                        isMessageMine(m, user)
                                            ? ''
                                            : css.reversed
                                    }`}
                                >
                                    <div
                                        className={
                                            css.message +
                                            ' ' +
                                            css[isMessageMineClass(m, user)]
                                        }
                                    >
                                        <p className={css.content}>
                                            {m.content}
                                        </p>
                                        <small
                                            className={css.timestamp}
                                            title={formatTimestampFull(
                                                m.timestamp
                                            )}
                                        >
                                            {timeAgo(m.timestamp.toDate())}
                                        </small>
                                    </div>
                                    <div className={css.messageAvatar}>
                                        <img
                                            className={css.imgUsernameAvatar}
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
                                                    : secondUser
                                            }
                                        />
                                        <small>
                                            {formatTimestampTime(m.timestamp)}
                                        </small>
                                    </div>
                                </div>
                                {displaySeparator && (
                                    <Separator
                                        key={index}
                                        text="Unread messages"
                                    />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className={css.loadingContainer}>
                        <FontAwesomeIcon
                            icon={faCircleNotch}
                            spin
                            size="2x"
                            color="silver"
                        />
                    </div>
                )}
            </div>
            <form className={css.formInputMessage}>
                <TextField
                    fullWidth
                    autoComplete="off"
                    color="warning"
                    className={css.inputMessage}
                    value={message}
                    onChange={(e) => setMessage(e.currentTarget.value)}
                    type="text"
                    placeholder="Write something"
                />
                <button
                    type="submit"
                    onClick={(e) =>
                        sendMessage(e, message, setMessage, user, room)
                    }
                >
                    Send
                </button>
            </form>
        </div>
    );
};
