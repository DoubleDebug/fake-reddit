import css from './Dropdown.module.css';
import { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

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
                <div
                    className={`${css.dropdownItem} ${
                        props.icon ? css.withIcon : ''
                    }`}
                >
                    {props.text}
                </div>
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
            <div>{props.text}</div>
        </div>
    );
};
