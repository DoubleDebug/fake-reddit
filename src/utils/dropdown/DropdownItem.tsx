import css from './Dropdown.module.css';
import { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

export interface IDropdownItemProps {
    text: string;
    action?: MouseEventHandler;
    redirectPath?: string;
}

export const DropdownItem: React.FC<IDropdownItemProps> = (props) => {
    if (props.redirectPath) {
        return (
            <Link to={props.redirectPath} style={{ textDecoration: 'none' }}>
                <div className={css.dropdownItem}>{props.text}</div>
            </Link>
        );
    }

    return (
        <div className={css.dropdownItem} onClick={props.action}>
            {props.text}
        </div>
    );
};
