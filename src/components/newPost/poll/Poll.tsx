import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { PollModel } from '../../../models/poll';
import styles from './Poll.module.css';

export const Poll: React.FC = () => {
    const [pollData, setPollData] = useState<PollModel>(new PollModel());

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
        <div className="grid">
            <div className={styles.container}>
                {pollData.options.map((option, index) => (
                    <div className="flex">
                        <input
                            key={`option${index}`}
                            type="text"
                            value={option}
                            placeholder={`Option ${index + 1}`}
                            onInput={(e) =>
                                updateOption(index, e.currentTarget.value)
                            }
                        />
                        {index > 1 ? (
                            <button
                                key={`btnDelete${index}`}
                                onClick={(e) => removeOption(e, index)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        ) : null}
                    </div>
                ))}
            </div>
            <button onClick={(e) => addOption(e)}>Add option</button>
        </div>
    );
};
