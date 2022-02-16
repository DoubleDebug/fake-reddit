import styles from './PollResults.module.css';
import { FormLabel } from '@mui/material';
import { PollModel } from '../../../models/poll';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

interface IPollResultsProps {
    postId: string;
    data: PollModel;
    chosenOption: string | null | undefined;
}

export const PollResults: React.FC<IPollResultsProps> = (props) => {
    const [results] = useState(props.data.getResults());
    const getSpecificResult = (option: string) => {
        return results.results.filter((r) => r.option === option)[0];
    };

    return (
        <div className={styles.container}>
            <FormLabel>{`${props.data.votes.length} votes`}</FormLabel>
            {props.data.options.map((option, index) => {
                // fill CSS animation
                setTimeout(() => {
                    const fill = document.getElementById(
                        `post_${props.postId}_fill_${index}`
                    );
                    if (!fill) return;
                    fill.style.width = `${
                        getSpecificResult(option).percentage
                    }%`;
                }, 0);

                return (
                    <div
                        key={index}
                        className={`${styles.option} ${
                            option === results.winner ? styles.winner : ''
                        }`}
                    >
                        <div
                            className={styles.fill}
                            id={`post_${props.postId}_fill_${index}`}
                        ></div>
                        <p>{option}</p>
                        {option === props.chosenOption && (
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                style={{ marginLeft: '0.5rem' }}
                            />
                        )}
                        <small className={styles.numOfVotes}>
                            {`${getSpecificResult(option).numOfVotes} votes`}
                        </small>
                    </div>
                );
            })}
        </div>
    );
};
