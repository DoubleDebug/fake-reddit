import {
    DocumentReference,
    Firestore,
    Timestamp,
    updateDoc,
} from '@firebase/firestore';
import { doc } from 'firebase/firestore';
import { MouseEvent, useRef } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { Redirect, useLocation } from 'react-router';

export interface IChatter {
    id: string;
    name: string;
}

export interface IChatRoom {
    id: string;
    userIds: string[];
    userNames: string[];
    createdAt: Timestamp;
    messages: IMessage[];
}

interface IMessage {
    from: IChatter;
    content: string;
    timestamp: Timestamp;
}

interface IChatProps {
    firestore: Firestore;
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

    // ACTIONS
    const sendMessage = (e: MouseEvent<HTMLButtonElement>, text: string) => {
        e.preventDefault();
        if (!room) return;

        // clear message
        if (inputMessage.current) inputMessage.current.value = '';

        // add message to db
        updateDoc(doc(props.firestore, 'chatRooms', room.id), {
            ...room,
            messages: room.messages.concat({
                from: {
                    id: room.userIds[0],
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
        <div>
            Chatting room {room?.id} with between {room?.userNames[0]} and{' '}
            {room?.userNames[1]}
            <div>
                {room &&
                    room.messages.map((m: IMessage, index: number) => {
                        return (
                            <div key={index}>
                                <p>
                                    {m.content} (
                                    {m.timestamp
                                        .toDate()
                                        .toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                        })}
                                    )
                                </p>
                            </div>
                        );
                    })}
            </div>
            <form>
                <input
                    ref={inputMessage}
                    type="text"
                    placeholder="Send message"
                />
                <button
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
