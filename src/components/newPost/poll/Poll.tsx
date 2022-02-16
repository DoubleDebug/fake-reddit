import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { PollModel } from '../../../models/poll';
import { displayNotif } from '../../../utils/toast';
import styles from './Poll.module.css';

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

    // ACTIONS
    type RMouseEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
    const updateOption = (index: number, newValue: string) => {
        const validationStatus = pollData.validateNewOption(newValue);
        if (!validationStatus.success) {
            displayNotif(validationStatus.message, 'error', true);
            return;
        }

        setPollData(pollData.update(index, newValue));
    };
    const addOption = (e: RMouseEvent) => {
        e.preventDefault();
        setPollData(pollData.add());
    };
    const removeOption = (e: RMouseEvent, index: number) => {
        e.preventDefault();
        setPollData(pollData.remove(index));
    };

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
                                updateOption(index, e.currentTarget.value)
                            }
                        />
                        {index > 1 ? (
                            <button
                                key={`btnDelete${index}`}
                                className={styles.btnRemoveOption}
                                onClick={(e) => removeOption(e, index)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        ) : null}
                    </div>
                ))}
            </div>
            <button
                className={styles.btnAddOption}
                onClick={(e) => addOption(e)}
            >
                Add option
            </button>
        </div>
    );
};
