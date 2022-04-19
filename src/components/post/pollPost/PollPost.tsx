import { User } from 'firebase/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PollModel, PollVote } from '../../../models/poll';
import { PostModel } from '../../../models/post';
import { PollResults } from './pollResults/PollResults';
import { PollVoting } from './pollVoting/PollVoting';

interface IPollPostProps {
    user: User | null | undefined;
    data: PostModel;
    linkTo?: string;
}

export const PollPost: React.FC<IPollPostProps> = (props) => {
    const [chosenOption, setChosenOption] = useState<PollVote | null>(
        props.data.pollData?.votes.filter(
            (v) => v.uid === props.user?.uid || ''
        )[0] || null
    );

    if (!props.data) return null;
    if (!props.user) {
        return (
            <PollResults
                postId={props.data.id || ''}
                data={new PollModel(props.data.pollData)}
                chosenOption={null}
            />
        );
    }

    return chosenOption ? (
        props.linkTo ? (
            <Link to={props.linkTo} className="linkNoUnderline">
                <PollResults
                    postId={props.data.id || ''}
                    data={new PollModel(props.data.pollData)}
                    chosenOption={chosenOption!.option}
                />
            </Link>
        ) : (
            <PollResults
                postId={props.data.id || ''}
                data={new PollModel(props.data.pollData)}
                chosenOption={chosenOption!.option}
            />
        )
    ) : props.linkTo ? (
        <Link to={props.linkTo} className="linkNoUnderline">
            <PollVoting
                data={props.data.pollData!}
                isPreview={props.linkTo ? true : false}
                postId={props.data.id}
                uid={props.user.uid}
                setChosenOption={(o) =>
                    setChosenOption({ option: o, uid: props.user!.uid })
                }
            />
        </Link>
    ) : (
        <PollVoting
            data={props.data.pollData!}
            isPreview={props.linkTo ? true : false}
            postId={props.data.id}
            uid={props.user.uid}
            setChosenOption={(o) =>
                setChosenOption({ option: o, uid: props.user!.uid })
            }
        />
    );
};
