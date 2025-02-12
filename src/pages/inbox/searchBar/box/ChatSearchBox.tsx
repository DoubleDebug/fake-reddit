import css from './ChatSearchBox.module.css';
import { SearchBox } from 'react-instantsearch';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ChatSearchBox: React.FC = () => {
  return (
    <div className={css.container}>
      <FontAwesomeIcon
        icon={faSearch}
        color="silver"
        className={css.icon}
        size="sm"
      />
      <SearchBox />
    </div>
  );
};
