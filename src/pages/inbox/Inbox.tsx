import css from './Inbox.module.css';
import { FC, useContext, useEffect, useState } from 'react';
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
import { usePrevious } from '../../utils/misc/usePrevious';
import { getSelectedRoom, removeUnreadMessages } from './InboxActions';
import { DeleteModal } from '../../components/modals/deleteModal/DeleteModal';
import { ReportModal } from '../../components/modals/reportModal/ReportModal';
import {
  getSecondUser,
  getUsernameById,
} from '../../utils/misc/whichUserUtils';
import { deleteConversation } from './chat/ChatActions';
import { Navigate } from '@tanstack/react-router';

type Props = {
  roomId?: string;
};

export const Inbox: FC<Props> = ({ roomId }) => {
  const user = useContext(UserContext);
  const [rooms, loadingRooms] = useCollectionData<IChatRoom>(
    query(
      collection(getFirestore(), DB_COLLECTIONS.CHAT_ROOMS),
      where('userIds', 'array-contains', user?.uid || ''),
    ) as Query<IChatRoom>,
  );
  const [selectedRoom, setSelectedRoom] = useState(roomId);
  const prevSelectedRoom = usePrevious(selectedRoom);
  const [displayHits, setDisplayHits] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!rooms || !user || !selectedRoom) {
      document.title = `Inbox | Moj Reddit`;
      return;
    }
    const selRoom = getSelectedRoom(rooms, selectedRoom);
    const secondUser = getUsernameById(
      selRoom,
      getSecondUser(user.uid, selRoom.userIds) || '',
    );
    document.title = `Chat with ${secondUser} | Moj Reddit`;
    // eslint-disable-next-line
  }, [selectedRoom]);

  useEffect(() => {
    const prevRoom = rooms?.filter((r) => r.id === prevSelectedRoom)[0];
    if (!prevRoom) return;

    removeUnreadMessages(user, prevRoom);
    // eslint-disable-next-line
  }, [selectedRoom]);

  if (!loadingRooms && !user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {showReportModal && rooms && selectedRoom && (
        <ReportModal
          type="user"
          contentId={
            getSecondUser(
              user?.uid,
              getSelectedRoom(rooms, selectedRoom).userIds,
            ) || ''
          }
          showStateHandler={setShowReportModal}
        />
      )}
      {showDeleteModal && rooms && selectedRoom && (
        <DeleteModal
          itemBeingDeleted="conversation"
          showStateHandler={setShowDeleteModal}
          action={() =>
            deleteConversation(getSelectedRoom(rooms, selectedRoom))
          }
        />
      )}
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
          {selectedRoom && (
            <Chat
              roomId={selectedRoom}
              setShowDeleteModal={setShowDeleteModal}
              setShowReportModal={setShowReportModal}
            />
          )}
        </div>
      </div>
    </>
  );
};
