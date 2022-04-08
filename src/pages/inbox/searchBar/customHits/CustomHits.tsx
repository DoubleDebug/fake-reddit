import css from './CustomHits.module.css';
import { User } from 'firebase/auth';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { HitsProvided } from 'react-instantsearch-core';
import { connectHits } from 'react-instantsearch-dom';
import { ValidatedHit } from '../../userHit/ValidatedHit';

interface IMyHitsProps extends HitsProvided<unknown> {
    user: User;
    rooms: Data<IChatRoom, '', ''>[] | undefined;
    setSelectedRoom: (rid: string) => void;
}

const MyHits: React.FC<IMyHitsProps> = (props) => {
    if (props.hits.length === 0) {
        return <p className={css.noHits}>No users found.</p>;
    }

    return (
        <div>
            {props.hits.map((data) => (
                <ValidatedHit
                    user={props.user}
                    rooms={props.rooms}
                    data={data}
                    setSelectedRoom={props.setSelectedRoom}
                />
            ))}
        </div>
    );
};

export const CustomHits = connectHits(MyHits);
