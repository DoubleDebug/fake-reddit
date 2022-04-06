import css from './Conversations.module.css';
import Skeleton from 'react-loading-skeleton';

const numOfSkeletons = 3;
const conversationSkeletons: JSX.Element[] = [];
for (let i = 0; i < numOfSkeletons; i++) {
    conversationSkeletons.push(
        <div
            key={`conv-skeleton-${i}`}
            className={css.conversation}
            style={{ paddingLeft: '1rem' }}
        >
            <Skeleton width={40} height={40} circle />
            <div className={css.nameSkeleton}>
                <Skeleton width={110} height={15} />
                <Skeleton width={180} height={15} />
            </div>
        </div>
    );
}

export const ConversationSkeletons: React.FC = () => {
    return <div className={css.conversations}>{conversationSkeletons}</div>;
};
