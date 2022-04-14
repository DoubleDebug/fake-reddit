import css from './Poll.module.css';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { PollModel } from '../../../models/poll';
import { addOption, removeOption, updateOption } from './PollActions';
import { TextField } from '@mui/material';

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
        props.handleNewState(pollData);
        // eslint-disable-next-line
    }, [pollData]);

    return (
        <div className={css.container}>
            <div className={css.options}>
                {pollData.options.map((option, index) => (
                    <div className="flex" key={`option${index}`}>
                        <TextField
                            placeholder="Option"
                            type="text"
                            className={css.textbox}
                            style={{
                                marginLeft: index > 1 ? '58px' : '0',
                            }}
                            value={option}
                            onChange={(e) =>
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
                                className={css.btnRemoveOption}
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
            {pollData.options.length <= 9 && (
                <button
                    className={css.btnAddOption}
                    onClick={(e) => addOption(e, pollData, setPollData)}
                >
                    Add option
                </button>
            )}
        </div>
    );
};
