import convoCSS from '../conversations/Conversations.module.css';
import { useState } from 'react';
import { InstantSearch, Hits } from 'react-instantsearch-dom';
import { Conversations } from '../conversations/Conversations';
import { ValidatedHit } from '../userHit/ValidatedHit';
import { ChatSearchBox } from './box/ChatSearchBox';
import { getSearchClient } from '../../../utils/misc/algoliaClient';
import { User } from 'firebase/auth';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { ALG_INDICES } from '../../../utils/misc/constants';

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

    return (
        <InstantSearch
            indexName={ALG_INDICES.USERS}
            searchClient={searchClient}
        >
            <ChatSearchBox
                onChangeCallback={(q: string) => {
                    if (q.length >= 2) props.setDisplayHits(true);
                    else props.setDisplayHits(false);
                }}
            />
            <div className={convoCSS.container}>
                <Conversations
                    user={props.user}
                    rooms={props.rooms}
                    selectedRoom={props.selectedRoom}
                    handleRoomChange={(rid) => props.setSelectedRoom(rid)}
                >
                    {props.displayHits && (
                        <Hits
                            hitComponent={(data: any) => (
                                <ValidatedHit
                                    user={props.user}
                                    rooms={props.rooms}
                                    data={data}
                                    setSelectedRoom={props.setSelectedRoom}
                                />
                            )}
                        />
                    )}
                </Conversations>
            </div>
        </InstantSearch>
    );
};
