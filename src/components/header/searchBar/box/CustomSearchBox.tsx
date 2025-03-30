import { Paper } from '@mui/material';
import { FC, useContext } from 'react';
import css from './CustomSearchBox.module.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HeaderContext } from '../../../../context/HeaderContext';
import { SearchBox as InstantSearchBox } from 'react-instantsearch';

export const CustomSearchBox: FC = () => {
  const { isSearchBarFocused, setIsSearchBarFocused } =
    useContext(HeaderContext);

  return (
    <Paper className={`${css.paper} ${isSearchBarFocused ? css.focused : ''}`}>
      <FontAwesomeIcon
        icon={faSearch}
        color="silver"
        className={css.icon}
        onClick={(e) => {
          setIsSearchBarFocused(true);
          let parentEl = (e.target as HTMLElement).parentElement;
          if (parentEl?.tagName === 'svg') {
            parentEl = parentEl.parentElement;
          }
          setTimeout(() => parentEl?.querySelector('input')?.focus(), 10);
        }}
      />
      <InstantSearchBox
        onFocus={() => setIsSearchBarFocused(true)}
        onBlur={() => setTimeout(() => setIsSearchBarFocused(false), 100)}
      />
    </Paper>
  );
};
