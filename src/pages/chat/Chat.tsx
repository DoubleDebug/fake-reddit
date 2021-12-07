import { User } from '@firebase/auth';

interface IChat {
    user: User | undefined | null;
    redditor: {
        id: string;
        name: string;
    };
}

export const Chat: React.FC<IChat> = (props) => {
    if (!props.user) return <div></div>;
    return (
        <div>
            Chatting room with between {props.user.uid} and {props.redditor.id}
        </div>
    );
};
