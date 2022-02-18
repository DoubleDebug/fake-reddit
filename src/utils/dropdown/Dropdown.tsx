import React from 'react';
import styles from './Dropdown.module.css';
import { DropdownMenu, IDropdownProps } from './DropdownMenu';

interface DropdownState {
    showMenu: boolean;
}

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
