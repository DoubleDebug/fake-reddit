import css from './CustomSearchBox.module.css';
import { Paper, TextField } from '@mui/material';
import { connectSearchBox } from 'react-instantsearch-dom';
import React, { FormEvent, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { HeaderContext } from '../../../../context/HeaderContext';

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
  const { isSearchBarFocused, setIsSearchBarFocused } =
    useContext(HeaderContext);

  return (
    <Paper
      component="form"
      className={`${css.paper} ${isSearchBarFocused ? css.focused : ''}`}
      onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
    >
      <FontAwesomeIcon icon={faSearch} color="silver" className={css.icon} />
      <TextField
        autoComplete="off"
        fullWidth
        variant="filled"
        type="search"
        placeholder="Search Reddit"
        color="warning"
        value={currentRefinement}
        className={css.box}
        onChange={(e) => {
          const query = e.currentTarget.value;
          onChangeCallback(query);
          refine(query);
        }}
        onBlur={() => {
          setTimeout(onBlurCallback, 200);
          setIsSearchBarFocused(false);
        }}
        onFocus={(e) => {
          const query = e.currentTarget.value;
          onFocusCallback(query);
          setIsSearchBarFocused(true);
        }}
      />
    </Paper>
  );
};

export const CustomSearchBox = connectSearchBox(SearchBox);
