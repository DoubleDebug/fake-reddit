import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField, InputAdornment } from '@mui/material';
import { IEditProfileState } from '../../EditProfile';

interface IEditUsernameProps {
  state: string;
  setState: (s: IEditProfileState) => void | undefined;
  usernameError: string | undefined;
  setUsernameError: (e: string | undefined) => void;
  isSaving: boolean;
}

export const EditUsername: React.FC<IEditUsernameProps> = (props) => {
  return (
    <TextField
      value={props.state}
      onChange={(e) => props.setState({ username: e.target.value })}
      error={props.usernameError !== undefined}
      helperText={props.usernameError}
      label="Username"
      type="text"
      autoComplete="off"
      inputProps={{
        maxLength: 20,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon
              icon={faInfoCircle}
              color="lightblue"
              title="Username requirements:&#013;
                - Length: 3 to 20 characters.&#013;
                - Allowed characters: a-z, A-Z, 0-9, dot and underscore.&#013;
                - Cannot start or end with a dot.&#013;
                - Cannot have two consecutive dots.&#013;"
            />
          </InputAdornment>
        ),
      }}
      disabled={props.isSaving}
    />
  );
};
