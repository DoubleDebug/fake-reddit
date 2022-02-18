import { MouseEventHandler } from 'react';
import styles from './Dropdown.module.css';

export interface IDropdownItemProps {
    text: string;
    action: MouseEventHandler;
}

export const DropdownItem: React.FC<IDropdownItemProps> = (props) => {
    return (
        <div className={styles.dropdownItem} onClick={props.action}>
            {props.text}
        </div>
    );
};
