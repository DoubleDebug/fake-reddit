import css from './Dropdown.module.css';
import React from 'react';
import { DropdownMenu, IDropdownProps } from './DropdownMenu';

interface DropdownState {
    showMenu: boolean;
    ref: React.RefObject<HTMLDivElement>;
}

export class Dropdown extends React.Component<IDropdownProps, DropdownState> {
    constructor(props: IDropdownProps) {
        super(props);

        // default values
        this.state = {
            showMenu: false,
            ref: React.createRef(),
        };

        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside(e: MouseEvent) {
        if (
            this.state.ref &&
            !this.state.ref.current?.contains(e.target as any)
        ) {
            this.setState({
                ...this.state,
                showMenu: false,
            });
        }
    }

    render() {
        return (
            <div
                ref={this.state.ref}
                className={css.dropdown}
                onClick={() =>
                    this.setState((ps) => ({
                        ...this.state,
                        showMenu: !ps.showMenu,
                    }))
                }
                style={this.props.style}
            >
                {this.props.children}
                {this.state.showMenu && (
                    <DropdownMenu items={this.props.items}></DropdownMenu>
                )}
            </div>
        );
    }
}
