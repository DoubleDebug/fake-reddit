import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { PollModel, PollVote } from '../../../models/poll';
import { DB_COLLECTIONS } from '../../../utils/constants';
import { displayNotif } from '../../../utils/toast';
import styles from './PollVoting.module.css';

interface IPollVotingProps {
    data: PollModel;
    isPreview: boolean;
    postId: string | undefined;
    uid: string | null | undefined;
}

export const PollVoting: React.FC<IPollVotingProps> = (props) => {
    const [chosenOption, setChosenOption] = useState<string | undefined>();
    const [isUploading, setIsUploading] = useState<boolean>(false);

    return (
        <div className="flex">
            <RadioGroup
                name="poll"
                className={styles.pollContainer}
                onChange={(e) => setChosenOption(e.target.value)}
            >
                <FormLabel>{`${props.data.votes.length} votes`}</FormLabel>
                {props.data.options.map((option, index) => (
                    <FormControlLabel
                        key={`option${index}`}
                        value={option}
                        control={<Radio />}
                        label={option}
                        htmlFor="poll"
                    />
                ))}
            </RadioGroup>
            {!props.isPreview && props.uid && (
                <button
                    className={`btn ${styles.btnVote}`}
                    type="submit"
                    disabled={isUploading}
                    onClick={() => {
                        if (!props.uid) return;
                        if (!chosenOption) return;
                        if (!props.postId) {
                            displayNotif(
                                'Failed to submit your vote.',
                                'error'
                            );
                            return;
                        }
                        if (
                            props.data.votes
                                .map((v) => v.uid)
                                .includes(props.uid)
                        )
                            return;

                        setIsUploading(true);
                        submitVote(
                            props.uid,
                            props.postId,
                            props.data,
                            chosenOption,
                            props.data.votes,
                            () => {
                                setIsUploading(false);
                            }
                        );
                    }}
                >
                    {isUploading ? (
                        <FontAwesomeIcon
                            icon={faCircleNotch}
                            spin
                            style={{
                                margin: '0 0.5rem',
                            }}
                        ></FontAwesomeIcon>
                    ) : (
                        'Vote'
                    )}
                </button>
            )}
        </div>
    );
};

// ACTIONS

const submitVote = (
    uid: string,
    postId: string,
    pollData: PollModel,
    chosenOption: string,
    votes: PollVote[],
    callback: Function
) => {
    const db = getFirestore();
    const docRef = doc(db, DB_COLLECTIONS.POSTS, postId);
    updateDoc(docRef, {
        pollData: {
            ...pollData,
            votes: [...votes, { uid: uid, option: chosenOption }],
        },
    }).then(() => {
        callback();
    });
};
