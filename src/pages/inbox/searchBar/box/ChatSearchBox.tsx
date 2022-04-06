import css from './ChatSearchBox.module.css';
import TextField from '@mui/material/TextField';
import { connectSearchBox } from 'react-instantsearch-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface IChatSearchBoxProps {
    currentRefinement: string;
    refine: (q: string) => void;
    onChangeCallback: (q: string) => void;
}

const MyChatSearchBox: React.FC<IChatSearchBoxProps> = (props) => {
    return (
        <div className={css.container}>
            <FontAwesomeIcon
                icon={faSearch}
                color="silver"
                className={css.icon}
                size="sm"
            />
            <TextField
                fullWidth
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
        </div>
    );
};

export const ChatSearchBox = connectSearchBox(MyChatSearchBox);
