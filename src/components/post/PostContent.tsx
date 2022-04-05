import css from './Post.module.css';
import Skeleton from 'react-loading-skeleton';
import { Markup } from 'interweave';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { PollModel } from '../../models/poll';
import { PostModel } from '../../models/post';
import { PollResults } from './pollResults/PollResults';
import { PollVoting } from './pollVoting/PollVoting';

interface IPostContentProps {
    data: PostModel;
    isPreview?: boolean;
    hasVoted: boolean;
}

export const PostContent: React.FC<IPostContentProps> = (props) => {
    const user = useContext(UserContext);
    return (
        <div
            className={`${css.postContent} ${
                props.isPreview ? css.preview : ''
            }`}
        >
            {props.data.pollData ? (
                props.hasVoted ? (
                    <PollResults
                        postId={props.data.id || ''}
                        data={new PollModel(props.data.pollData)}
                        chosenOption={
                            user &&
                            props.data.pollData.votes.filter(
                                (v) => v.uid === user?.uid
                            )[0]?.option
                        }
                    />
                ) : user ? (
                    <PollVoting
                        data={props.data.pollData}
                        isPreview={false}
                        postId={props.data.id}
                        uid={user.uid}
                    />
                ) : (
                    <PollResults
                        postId={props.data.id || ''}
                        data={new PollModel(props.data.pollData)}
                        chosenOption={null}
                    />
                )
            ) : (
                <Markup content={props.data.content}></Markup>
            )}
            {!props.data.content && !props.data.pollData && (
                <Skeleton count={5} />
            )}
            {props.isPreview ? <div className={css.fade}></div> : null}
        </div>
    );
};
