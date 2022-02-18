import styles from './Dropdown.module.css';
import { DropdownItem, IDropdownItemProps } from './DropdownItem';

export interface IDropdownProps {
    items: IDropdownItemProps[];
}

export const DropdownMenu: React.FC<IDropdownProps> = (props) => {
    return (
        <div className={styles.dropdownMenu}>
            {props.items.map((item, index) => (
                <DropdownItem {...item} key={index}></DropdownItem>
            ))}
        </div>
    );
};
