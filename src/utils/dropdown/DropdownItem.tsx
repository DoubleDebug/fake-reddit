import css from './Dropdown.module.css';
import { MouseEventHandler } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@tanstack/react-router';

export interface IDropdownItemProps {
  text: string;
  action?: MouseEventHandler;
  redirectPath?: string;
  icon?: IconDefinition;
}

export const DropdownItem: React.FC<IDropdownItemProps> = (props) => {
  if (props.redirectPath) {
    return (
      <Link to={props.redirectPath} className={css.link}>
        {props.icon && (
          <FontAwesomeIcon
            icon={props.icon}
            color="silver"
            className={css.icon}
          />
        )}
        <p className={`${css.dropdownItem} ${props.icon ? css.withIcon : ''}`}>
          {props.text}
        </p>
      </Link>
    );
  }

  return (
    <div
      className={`${css.dropdownItem} ${props.icon ? css.withIcon : ''}`}
      onClick={props.action}
    >
      {props.icon && (
        <FontAwesomeIcon
          icon={props.icon}
          color="silver"
          className={css.icon}
        />
      )}
      <p>{props.text}</p>
    </div>
  );
};
