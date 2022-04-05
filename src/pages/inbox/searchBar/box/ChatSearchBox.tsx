import css from './ChatSearchBox.module.css';
import TextField from '@mui/material/TextField';
import { connectSearchBox } from 'react-instantsearch-dom';

interface IChatSearchBoxProps {
    currentRefinement: string;
    refine: (q: string) => void;
    onChangeCallback: (q: string) => void;
}

const MyChatSearchBox: React.FC<IChatSearchBoxProps> = (props) => {
    return (
        <TextField
            className={css.searchBar}
            variant="filled"
            color="warning"
            placeholder="Search..."
            autoComplete="off"
            onChange={(e) => {
                const newValue = e.currentTarget.value;
                props.onChangeCallback(newValue);
                props.refine(newValue);
            }}
            value={props.currentRefinement}
        />
    );
};

export const ChatSearchBox = connectSearchBox(MyChatSearchBox);
