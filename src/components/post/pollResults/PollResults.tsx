import css from './PollResults.module.css';
import { PollModel } from '../../../models/poll';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { getSpecificResult } from './PollResultsActions';

interface IPollResultsProps {
    postId: string;
    data: PollModel;
    chosenOption: string | null | undefined;
}

export const PollResults: React.FC<IPollResultsProps> = (props) => {
    const [results] = useState(props.data.getResults());

    return (
        <div className={css.container}>
            <p
                style={{ marginBottom: '0.5rem' }}
            >{`${props.data.votes.length} votes`}</p>
            {props.data.options.map((option, index) => {
                // fill CSS animation
                setTimeout(() => {
                    const fill = document.getElementById(
                        `post_${props.postId}_fill_${index}`
                    );
                    if (!fill) return;
                    fill.style.width = `${
                        getSpecificResult(results, option).percentage
                    }%`;
                }, 0);

                return (
                    <div
                        key={index}
                        className={`${css.option} ${
                            option === results.winner ? css.winner : ''
                        }`}
                    >
                        <div
                            className={css.fill}
                            id={`post_${props.postId}_fill_${index}`}
                        ></div>
                        <p>{option}</p>
                        {option === props.chosenOption && (
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                style={{ marginLeft: '0.5rem' }}
                                title={`You voted ${props.chosenOption}`}
                            />
                        )}
                        <small className={css.numOfVotes}>
                            {`${
                                getSpecificResult(results, option).numOfVotes
                            } votes`}
                        </small>
                    </div>
                );
            })}
        </div>
    );
};
