import styles from '../NewPost.module.css';
import { useEffect, useState } from 'react';
import { ISubreddit } from '../../../models/subreddit';
import {
    getFlairsFromSubreddit,
    getSelectedSubreddit,
} from '../NewPostActions';
import Select from 'react-select';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { selectStyles } from './SelectFlairsStyles';

interface ISelectFlairsProps {
    subreddits: Data<ISubreddit, '', ''>[] | undefined;
    subredditInput: React.MutableRefObject<any>;
    handleChange: (newFlair: string | undefined) => void;
}

export const SelectFlairs: React.FC<ISelectFlairsProps> = (props) => {
    const [subreddit, setSubreddit] = useState<ISubreddit | undefined>();

    useEffect(() => {
        setSubreddit(
            getSelectedSubreddit(props.subreddits, props.subredditInput)
        );
    }, [props.subreddits, props.subredditInput]);

    return subreddit ? (
        <Select
            className={styles.selectFlair}
            placeholder="Choose a flair"
            options={getFlairsFromSubreddit(
                props.subreddits,
                props.subredditInput
            )}
            styles={selectStyles}
            onChange={(val) => props.handleChange(val?.value)}
            isClearable={true}
        />
    ) : null;
};
