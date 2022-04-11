import css from '../conversations/Conversations.module.css';
import { useState } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { Conversations } from '../conversations/Conversations';
import { ChatSearchBox } from './box/ChatSearchBox';
import { getSearchClient } from '../../../utils/misc/algoliaClient';
import { User } from 'firebase/auth';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { ALG_INDICES } from '../../../utils/misc/constants';
import { CustomHits } from './customHits/CustomHits';

interface IChatSearchBarProps {
    user: User;
    rooms: Data<IChatRoom, '', ''>[] | undefined;
    selectedRoom: string;
    setSelectedRoom: (rid: string) => void;
    displayHits: boolean;
    setDisplayHits: (d: boolean) => void;
}

export const ChatSearchBar: React.FC<IChatSearchBarProps> = (props) => {
    const [searchClient] = useState(getSearchClient());
    const [currentQuery, setCurrentQuery] = useState('');

    const hasQuery = currentQuery.length >= 2;
    const hasRooms = props.rooms ? props.rooms?.length > 0 : false;

    return (
        <InstantSearch
            indexName={ALG_INDICES.USERS}
            searchClient={searchClient}
        >
            <ChatSearchBox
                onChangeCallback={(q: string) => {
                    setCurrentQuery(q);
                    if (q.length >= 2) props.setDisplayHits(true);
                    else props.setDisplayHits(false);
                }}
            />
            <div className={css.container}>
                {hasQuery || hasRooms ? (
                    <Conversations
                        user={props.user}
                        rooms={props.rooms}
                        selectedRoom={props.selectedRoom}
                        handleRoomChange={(rid) => props.setSelectedRoom(rid)}
                    >
                        {props.displayHits && (
                            <CustomHits
                                user={props.user}
                                rooms={props.rooms}
                                setSelectedRoom={props.setSelectedRoom}
                            />
                        )}
                    </Conversations>
                ) : (
                    !hasRooms && (
                        <div className={css.noConversations}>
                            <p>No conversations yet.</p>
                            <p>Search for someone to chat with.</p>
                        </div>
                    )
                )}
            </div>
        </InstantSearch>
    );
};
