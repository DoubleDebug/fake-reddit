import { MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dropdown.module.css';

export interface IDropdownItemProps {
    text: string;
    action?: MouseEventHandler;
    redirectPath?: string;
}

export const DropdownItem: React.FC<IDropdownItemProps> = (props) => {
    if (props.redirectPath) {
        return (
            <Link to={props.redirectPath} style={{ textDecoration: 'none' }}>
                <div className={styles.dropdownItem}>{props.text}</div>
            </Link>
        );
    }

    return (
        <div className={styles.dropdownItem} onClick={props.action}>
            {props.text}
        </div>
    );
};
