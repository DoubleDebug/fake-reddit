import { User } from 'firebase/auth';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { UserHit } from './UserHit';

interface IValidatedHitProps {
    user: User;
    rooms: Data<IChatRoom, '', ''>[] | undefined;
    data: any;
    setSelectedRoom: (rid: string) => void;
}

export const ValidatedHit: React.FC<IValidatedHitProps> = (props) => {
    // validation
    if (props.data.objectID === props.user.uid) return null;
    const existingRooms = props.rooms?.filter((r) =>
        r.userIds.includes(props.data.objectID)
    ).length;
    if (existingRooms && existingRooms > 0) return null;

    return (
        <UserHit
            {...props.data}
            setSelectedRoom={(rid: string) => props.setSelectedRoom(rid)}
        />
    );
};
