import css from './Inbox.module.css';
import { useContext, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { Chat } from './chat/Chat';
import {
    query,
    collection,
    getFirestore,
    where,
    Query,
} from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { DB_COLLECTIONS } from '../../utils/misc/constants';
import { ChatSearchBar } from './searchBar/ChatSearchBar';

export const Inbox: React.FC = () => {
    const user = useContext(UserContext);
    const { id: roomId } = useParams<{ id: string }>();
    const [rooms] = useCollectionData<IChatRoom>(
        query(
            collection(getFirestore(), DB_COLLECTIONS.CHAT_ROOMS),
            where('userIds', 'array-contains', user?.uid || '')
        ) as Query<IChatRoom>,
        {
            idField: 'id',
        }
    );
    const [selectedRoom, setSelectedRoom] = useState(roomId);
    const [displayHits, setDisplayHits] = useState(false);

    if (!user) return <Redirect to="/" />;

    return (
        <div className={`contentBox ${css.container}`}>
            <h1 className={css.lblInbox}>Messages</h1>
            <div className="flex">
                <div className={css.leftPanel}>
                    <ChatSearchBar
                        user={user}
                        rooms={rooms}
                        displayHits={displayHits}
                        setDisplayHits={setDisplayHits}
                        selectedRoom={selectedRoom}
                        setSelectedRoom={setSelectedRoom}
                    />
                </div>
                <Chat roomId={selectedRoom} />
            </div>
        </div>
    );
};
