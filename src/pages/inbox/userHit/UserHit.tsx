import convoCSS from '../conversations/Conversations.module.css';
import { useContext } from 'react';
import { openChatRoom } from '../../../components/post/PostActions';
import { UserContext } from '../../../context/UserContext';

interface IUserHitProps {
  objectID: string;
  name: string;
  photoURL: string;
  setSelectedRoom: (rid: string) => void;
}

export const UserHit: React.FC<IUserHitProps> = (props) => {
  const user = useContext(UserContext);
  return (
    <div
      key={props.objectID}
      className={convoCSS.conversation}
      onClick={() => {
        openChatRoom(
          user,
          {
            id: props.objectID,
            name: props.name,
          },
          (roomId: string | null) => roomId && props.setSelectedRoom(roomId),
        );
      }}
    >
      <img src={props.photoURL} alt={props.name} className={convoCSS.photo} />
      <div className="grid">
        <p className={convoCSS.name}>{props.name}</p>
        <small className={convoCSS.lastMessage}>Start a new conversation</small>
      </div>
    </div>
  );
};
