import { useContext, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Chat } from './chat/Chat';
import { Conversations } from './conversations/Conversations';
import styles from './Inbox.module.css';

interface IInboxProps {
    test?: string;
}

export const Inbox: React.FC<IInboxProps> = () => {
    const user = useContext(UserContext);
    const { id: roomId } = useParams<{ id: string }>();
    const [selectedRoom, setSelectedRoom] = useState(roomId);

    if (!user) return <Redirect to="/" />;

    return (
        <div className={`contentBox ${styles.container}`}>
            <h1 className={styles.lblInbox}>Messages</h1>
            <div className="flex">
                <Conversations
                    user={user}
                    selectedRoom={selectedRoom}
                    handleRoomChange={(rid) => setSelectedRoom(rid)}
                />
                <Chat roomId={selectedRoom} />
            </div>
        </div>
    );
};
