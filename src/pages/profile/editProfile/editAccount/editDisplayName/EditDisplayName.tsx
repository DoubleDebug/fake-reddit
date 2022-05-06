import { TextField } from '@mui/material';

interface IEditDisplayNameState {
    displayName?: string;
}

interface IEditDisplayNameProps {
    displayNameError: string | undefined;
    isLoading?: boolean;
    state: IEditDisplayNameState;
    handleNewState: (s: IEditDisplayNameState) => void;
}

export const EditDisplayName: React.FC<IEditDisplayNameProps> = (props) => {
    return (
        <TextField
            value={props.state.displayName}
            onChange={(e) =>
                props.handleNewState({ displayName: e.target.value })
            }
            disabled={props.isLoading}
            error={props.displayNameError !== undefined}
            helperText={props.displayNameError}
            label="Display name"
            type="text"
            autoComplete="off"
        />
    );
};
