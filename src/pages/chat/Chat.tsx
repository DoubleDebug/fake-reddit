import './Chat.css';
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
import { DEFAULT_USER_AVATAR_URL } from '../../utils/constants';
import { timeAgo } from '../../utils/timeAgo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

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
            'chatRooms',
            roomId || 'ERROR_NO_ROOM'
        ) as DocumentReference<IChatRoom>,
        {
            idField: 'id',
        }
    );
    const inputMessage = useRef<HTMLInputElement>(null);
    const [userData] = useDocumentDataOnce(
        doc(props.firestore, 'users', props.user!.uid)
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
                'users',
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
        updateDoc(doc(props.firestore, 'chatRooms', room.id), {
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

    if (error || !roomId) return <Redirect to="/"></Redirect>;
    if (loading) return <p>Loading...</p>;
    return (
        <div className="roomContainer">
            <div className="room">
                <div className="roomHeader">
                    <img
                        className="imgUsernameAvatar"
                        src={
                            user2PhotoURL
                                ? user2PhotoURL
                                : DEFAULT_USER_AVATAR_URL
                        }
                        alt="User profile"
                    />
                    <div className="roomUsernameContainer">
                        <h1 className="username">
                            {getUsernameById(
                                getSecondUser(props.user?.uid, room?.userIds)
                            )}
                        </h1>
                        <small className="lblLastOnline">
                            <FontAwesomeIcon
                                icon={faCircle}
                                color="LawnGreen"
                                style={{ marginRight: '7px' }}
                            />
                            {timeAgo(userData?.lastOnline.toDate())}
                        </small>
                    </div>
                </div>
                <hr className="separator" />
                {room &&
                    room.messages.map((m: IMessage, index: number) => {
                        if (!props.user) return null;
                        return (
                            <div
                                key={index}
                                className={
                                    'message ' +
                                    isMessageMineClass(m, props.user)
                                }
                            >
                                <p className="content">{m.content}</p>
                                <small className="timestamp">
                                    {formatTimestamp(m.timestamp)}
                                </small>
                            </div>
                        );
                    })}
            </div>
            <form className="formInputMessage">
                <input
                    className="inputMessage"
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
