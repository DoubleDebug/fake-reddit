import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { PollModel } from '../../../models/poll';
import styles from './Poll.module.css';

interface IPollProps {
    state?: PollModel;
    handleNewState: (state: PollModel) => void;
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
        return () => {
            props.handleNewState(pollData);
        };
        // eslint-disable-next-line
    }, [pollData]);

    // ACTIONS
    type RMouseEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
    const updateOption = (index: number, newValue: string) => {
        setPollData(
            new PollModel({
                ...pollData,
                options: (() => {
                    const newArr = Array.from(pollData.options);
                    newArr[index] = newValue;
                    return newArr;
                })(),
            })
        );
    };
    const addOption = (e: RMouseEvent) => {
        e.preventDefault();
        setPollData(
            new PollModel({
                ...pollData,
                options: [...pollData.options, ''],
            })
        );
    };
    const removeOption = (e: RMouseEvent, index: number) => {
        e.preventDefault();
        setPollData(
            new PollModel({
                ...pollData,
                options: (() => {
                    const newArr = Array.from(pollData.options);
                    newArr.splice(index, 1);
                    return newArr;
                })(),
            })
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.options}>
                {pollData.options.map((option, index) => (
                    <div className="flex">
                        <input
                            key={`option${index}`}
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
                            placeholder={`Option ${index + 1}`}
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
