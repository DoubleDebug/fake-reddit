import { Paper } from '@mui/material';
import css from './CustomSearchBox.module.css';
import { FC, FormEvent, useContext } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HeaderContext } from '../../../../context/HeaderContext';
import { SearchBox as InstantSearchBox } from 'react-instantsearch';

export const CustomSearchBox: FC = () => {
  const { isSearchBarFocused, setIsSearchBarFocused } =
    useContext(HeaderContext);

  return (
    <Paper
      component="form"
      className={`${css.paper} ${isSearchBarFocused ? css.focused : ''}`}
      onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
    >
      <FontAwesomeIcon icon={faSearch} color="silver" className={css.icon} />
      <InstantSearchBox
        onFocus={() => setIsSearchBarFocused(true)}
        onBlur={() => setTimeout(() => setIsSearchBarFocused(false), 100)}
      />
    </Paper>
  );
};
