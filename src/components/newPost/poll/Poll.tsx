import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { PollModel } from '../../../models/poll';
import styles from './Poll.module.css';
import { addOption, removeOption, updateOption } from './PollActions';

interface IPollProps {
    state?: PollModel;
    handleNewState: (state: PollModel) => void;
    handlePollData: (data: PollModel) => void;
}

export const Poll: React.FC<IPollProps> = (props) => {
    const [pollData, setPollData] = useState<PollModel>(new PollModel());

    // load previous state if possible
    useEffect(() => {
        if (props.state) {
            setPollData(props.state);
        }
        // eslint-disable-next-line
    }, []);
    // save state when switching tabs
    useEffect(() => {
        props.handlePollData(pollData);

        return () => {
            props.handleNewState(pollData);
        };
        // eslint-disable-next-line
    }, [pollData]);

    return (
        <div className={styles.container}>
            <div className={styles.options}>
                {pollData.options.map((option, index) => (
                    <div className="flex" key={`option${index}`}>
                        <input
                            type="text"
                            className={styles.textbox}
                            style={
                                index > 1
                                    ? {
                                          marginLeft: '63px',
                                      }
                                    : {}
                            }
                            value={option}
                            onInput={(e) =>
                                updateOption(
                                    index,
                                    e.currentTarget.value,
                                    pollData,
                                    setPollData
                                )
                            }
                        />
                        {index > 1 ? (
                            <button
                                key={`btnDelete${index}`}
                                className={styles.btnRemoveOption}
                                onClick={(e) =>
                                    removeOption(
                                        e,
                                        index,
                                        pollData,
                                        setPollData
                                    )
                                }
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        ) : null}
                    </div>
                ))}
            </div>
            <button
                className={styles.btnAddOption}
                onClick={(e) => addOption(e, pollData, setPollData)}
            >
                Add option
            </button>
        </div>
    );
};
