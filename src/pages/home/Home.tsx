import { User } from 'firebase/auth';
import { Feed } from '../../components/feed/Feed';

interface IHomeProps {
    user: User | undefined | null;
}

export const Home: React.FC<IHomeProps> = (props) => {
    return <Feed user={props.user} />;
};
