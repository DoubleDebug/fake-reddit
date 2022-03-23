import styles from './CustomSearchBox.module.css';
import { Paper, TextField } from '@mui/material';
import { connectSearchBox } from 'react-instantsearch-dom';
import React, { FormEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface ISearchBoxProps {
    currentRefinement: string;
    refine: (q: string) => void;
    onChangeCallback: (q: string) => void;
    onBlurCallback: () => void;
    onFocusCallback: (q: string) => void;
}

const SearchBox: React.FC<ISearchBoxProps> = ({
    currentRefinement,
    refine,
    onChangeCallback,
    onBlurCallback,
    onFocusCallback,
}) => {
    return (
        <Paper
            component="form"
            className={styles.paper}
            onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
        >
            <FontAwesomeIcon
                icon={faSearch}
                color="silver"
                className={styles.icon}
                size="sm"
            />
            <TextField
                autoComplete="off"
                fullWidth
                variant="filled"
                type="search"
                placeholder="Search Reddit"
                color="secondary"
                value={currentRefinement}
                className={styles.box}
                onChange={(e) => {
                    const query = e.currentTarget.value;
                    onChangeCallback(query);
                    refine(query);
                }}
                onBlur={() => setTimeout(onBlurCallback, 200)}
                onFocus={(e) => {
                    const query = e.currentTarget.value;
                    onFocusCallback(query);
                }}
            />
        </Paper>
    );
};

export const CustomSearchBox = connectSearchBox(SearchBox);
