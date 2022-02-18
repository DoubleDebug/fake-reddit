import { User } from 'firebase/auth';
import { Markup } from 'interweave';
import Skeleton from 'react-loading-skeleton';
import { PollModel } from '../../models/poll';
import { PostModel } from '../../models/post';
import { PollResults } from './pollResults/PollResults';
import { PollVoting } from './pollVoting/PollVoting';
import styles from './Post.module.css';

interface IPostContentProps {
    user: User | undefined | null;
    data: PostModel;
    isPreview?: boolean;
    hasVoted: boolean;
}

export const PostContent: React.FC<IPostContentProps> = (props) => {
    return (
        <div
            className={`${styles.postContent} ${
                props.isPreview ? styles.preview : ''
            }`}
        >
            {props.data.pollData ? (
                props.hasVoted ? (
                    <PollResults
                        postId={props.data.id || ''}
                        data={new PollModel(props.data.pollData)}
                        chosenOption={
                            props.user &&
                            props.data.pollData.votes.filter(
                                (v) => v.uid === props.user?.uid
                            )[0]?.option
                        }
                    />
                ) : props.user ? (
                    <PollVoting
                        data={props.data.pollData}
                        isPreview={false}
                        postId={props.data.id}
                        uid={props.user?.uid}
                    />
                ) : (
                    <PollResults
                        postId={props.data.id || ''}
                        data={new PollModel(props.data.pollData)}
                        chosenOption={
                            props.user &&
                            props.data.pollData.votes.filter(
                                (v) => v.uid === props.user?.uid
                            )[0]?.option
                        }
                    />
                )
            ) : (
                <Markup content={props.data.content}></Markup>
            )}
            {!props.data.content && !props.data.pollData && (
                <Skeleton count={5} />
            )}
            {props.isPreview ? <div className={styles.fade}></div> : null}
        </div>
    );
};
