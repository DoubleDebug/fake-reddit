import { ReactNode } from 'react';
import css from './Dropdown.module.css';
import { DropdownItem, IDropdownItemProps } from './DropdownItem';

export interface IDropdownProps {
    items: IDropdownItemProps[];
    style?: React.CSSProperties;
    children?: ReactNode;
}

export const DropdownMenu: React.FC<IDropdownProps> = (props) => {
    return (
        <div className={css.dropdownMenu}>
            {props.items.map((item, index) => (
                <DropdownItem {...item} key={index}></DropdownItem>
            ))}
        </div>
    );
};
