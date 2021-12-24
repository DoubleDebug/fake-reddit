import React, { MouseEventHandler } from 'react';
import styles from './Dropdown.module.css';

// PROPS
interface IDropdownProps {
    items: IDropdownItemProps[];
}

interface IDropdownItemProps {
    text: string;
    action: MouseEventHandler;
}

interface DropdownState {
    showMenu: boolean;
}

// COMPONENTS
export class Dropdown extends React.Component<IDropdownProps, DropdownState> {
    constructor(props: IDropdownProps) {
        super(props);

        // default values
        this.state = {
            showMenu: false,
        };
    }

    render() {
        return (
            <div
                className={styles.dropdown}
                onClick={() =>
                    this.setState((ps) => ({
                        showMenu: !ps.showMenu,
                    }))
                }
            >
                {this.props.children}
                {this.state.showMenu && (
                    <DropdownMenu items={this.props.items}></DropdownMenu>
                )}
            </div>
        );
    }
}

const DropdownMenu: React.FC<IDropdownProps> = (props) => {
    return (
        <div className={styles.dropdownMenu}>
            {props.items.map((item, index) => (
                <DropdownItem {...item} key={index}></DropdownItem>
            ))}
        </div>
    );
};

const DropdownItem: React.FC<IDropdownItemProps> = (props) => {
    return (
        <div className={styles.dropdownItem} onClick={props.action}>
            {props.text}
        </div>
    );
};
