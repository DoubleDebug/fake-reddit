import css from '../conversations/Conversations.module.css';
import { useState } from 'react';
import { InstantSearch } from 'react-instantsearch';
import { Conversations } from '../conversations/Conversations';
import { ChatSearchBox } from './box/ChatSearchBox';
import { getSearchClient } from '../../../utils/misc/algoliaClient';
import { User } from 'firebase/auth';
import { ALG_INDICES } from '../../../utils/misc/constants';
import { CustomHits } from './customHits/CustomHits';
import { useIsMobile } from '../../../utils/hooks/useIsMobile';

interface IChatSearchBarProps {
  user: User | null | undefined;
  rooms: IChatRoom[] | undefined;
  selectedRoom: string;
  setSelectedRoom: (rid: string) => void;
  displayHits: boolean;
  setDisplayHits: (d: boolean) => void;
}

export const ChatSearchBar: React.FC<IChatSearchBarProps> = (props) => {
  const [searchClient] = useState(getSearchClient());
  const [currentQuery] = useState('');
  const isMobile = useIsMobile();

  const hasQuery = currentQuery.length >= 2;
  const hasRooms = props.rooms ? props.rooms?.length > 0 : false;

  if (isMobile) {
    return (
      <div className={css.container}>
        {hasQuery || hasRooms
          ? props.user && (
              <Conversations
                user={props.user}
                rooms={props.rooms}
                selectedRoom={props.selectedRoom}
                handleRoomChange={(rid) => props.setSelectedRoom(rid)}
              >
                {props.displayHits && <CustomHits />}
              </Conversations>
            )
          : !hasRooms && (
              <div className={css.noConversations}>
                <p>No conversations yet.</p>
                <p>Search for someone to chat with.</p>
              </div>
            )}
      </div>
    );
  }

  return (
    <InstantSearch indexName={ALG_INDICES.USERS} searchClient={searchClient}>
      <ChatSearchBox />
      <div className={css.container}>
        {hasQuery || hasRooms
          ? props.user && (
              <Conversations
                user={props.user}
                rooms={props.rooms}
                selectedRoom={props.selectedRoom}
                handleRoomChange={(rid) => props.setSelectedRoom(rid)}
              >
                {props.displayHits && <CustomHits />}
              </Conversations>
            )
          : !hasRooms && (
              <div className={css.noConversations}>
                <p>No conversations yet.</p>
                <p>Search for someone to chat with.</p>
              </div>
            )}
      </div>
    </InstantSearch>
  );
};
