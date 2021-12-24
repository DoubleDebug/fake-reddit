import styles from './Chat.module.css';
import {
    DocumentReference,
    Firestore,
    getDoc,
    Timestamp,
    updateDoc,
} from '@firebase/firestore';
import { doc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import {
    useDocumentData,
    useDocumentDataOnce,
} from 'react-firebase-hooks/firestore';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import { Redirect, useLocation } from 'react-router';
import { formatTimestamp } from '../../utils/formatChatTimestamp';
import { isMessageMineClass } from '../../utils/isMessageMine';
import { DB_COLLECTIONS, DEFAULT_USER_AVATAR_URL } from '../../utils/constants';
import { timeAgo } from '../../utils/timeAgo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading-skeleton';

interface IChatProps {
    firestore: Firestore;
    user: User | undefined | null;
}

export const Chat: React.FC<IChatProps> = (props) => {
    const state = useLocation<any>().state;
    const roomId = state && state.roomId;
    const [room, loading, error] = useDocumentData<IChatRoom>(
        doc(
            props.firestore,
            DB_COLLECTIONS.CHAT_ROOMS,
            roomId || 'ERROR_NO_ROOM'
        ) as DocumentReference<IChatRoom>,
        {
            idField: 'id',
        }
    );
    const inputMessage = useRef<HTMLInputElement>(null);
    const [userData] = useDocumentDataOnce(
        doc(
            props.firestore,
            DB_COLLECTIONS.USERS,
            props.user?.uid || 'ERROR_NO_USER'
        )
    );
    const [user2PhotoURL, setUser2PhotoURL] = useState<string>(
        DEFAULT_USER_AVATAR_URL
    );
    const getSecondUser = (uid: any, all: any) => {
        if (all[0] === uid) return all[1];
        else return all[0];
    };
    const getUsernameById = (uid: string) => {
        return room?.userNames[
            room.userIds.findIndex((id: string) => id === uid)
        ];
    };

    // get 2nd user's photo URL
    useEffect(() => {
        if (!props.user || !room) return;

        getDoc(
            doc(
                props.firestore,
                DB_COLLECTIONS.USERS,
                getSecondUser(props.user.uid, room.userIds)
            )
        ).then((data: any) => {
            setUser2PhotoURL(data.data().photoURL);
        });
    }, [props.user, props.firestore, room]);

    // ACTIONS
    const sendMessage = (e: MouseEvent<HTMLButtonElement>, text: string) => {
        e.preventDefault();
        if (!room) return;
        if (!props.user) return;

        // clear message
        if (inputMessage.current) inputMessage.current.value = '';

        // add message to db
        updateDoc(doc(props.firestore, DB_COLLECTIONS.CHAT_ROOMS, room.id), {
            ...room,
            messages: room.messages.concat({
                from: {
                    id: props.user.uid,
                    name: room.userNames[0],
                },
                content: text,
                timestamp: Timestamp.now(),
            }),
        });
    };

    // check if user doesn't exist
    if (userData && !userData.lastOnline) return <Redirect to="/"></Redirect>;

    if (error || !roomId) return <Redirect to="/"></Redirect>;
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
                            src={
                                user2PhotoURL
                                    ? user2PhotoURL
                                    : DEFAULT_USER_AVATAR_URL
                            }
                            alt="User profile"
                        />
                    )}
                    <div className={styles.roomUsernameContainer}>
                        {loading ? (
                            <Skeleton width="300px"></Skeleton>
                        ) : (
                            <h1 className={styles.username}>
                                {getUsernameById(
                                    getSecondUser(
                                        props.user?.uid,
                                        room?.userIds
                                    )
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
                                {timeAgo(userData?.lastOnline.toDate())}
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
                                <small className={styles.timestamp}>
                                    {formatTimestamp(m.timestamp)}
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
                        sendMessage(e, inputMessage.current.value)
                    }
                >
                    Send
                </button>
            </form>
        </div>
    );
};
