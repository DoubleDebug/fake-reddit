import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Feed } from '../../components/feed/Feed';

interface IHomeProps {
    user: User | undefined | null;
    firestore: Firestore;
}

export const Home: React.FC<IHomeProps> = (props) => {
    return <Feed user={props.user} firestore={props.firestore} />;
};
