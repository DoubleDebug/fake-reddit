import { createTheme } from '@mui/material';
import { Theme } from 'react-select';

export const selectStyles = {
    option: (provided: any, state: { isSelected: any }) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'var(--colorOrange)' : undefined,
        cursor: 'pointer',
        ':hover': {
            ...provided[':hover'],
            backgroundColor: state.isSelected ? undefined : '#ffe8cb',
        },
        ':active': {
            ...provided[':active'],
            backgroundColor: 'var(--colorOrange)',
        },
    }),
    menu: (provided: any, state: any) => ({
        ...provided,
        background: state.isSelected ? 'var(--colorOrange)' : 'white',
    }),
    control: (provided: any, state: any) => ({
        ...provided,
        height: '44px',
        cursor: 'pointer',
        border: state.menuisOpen ? '2px solid black' : '1px solid silver',
        boxShadow: 'none',
        ':hover': {
            ...provided[':hover'],
            border: '1px solid silver',
        },
        background: state.hasValue ? 'var(--colorOrange)' : 'white',
    }),
    singleValue: (provided: any, state: any) => ({
        ...provided,
        color: state.hasValue ? 'white' : 'black',
    }),
};

export const selectTheme = (t: Theme) => ({
    ...t,
    colors: {
        ...t.colors,
        primary: '#ED6C02',
    },
});

export const tabsTheme = createTheme({
    palette: {
        primary: {
            main: '#ED6C02',
        },
    },
});
