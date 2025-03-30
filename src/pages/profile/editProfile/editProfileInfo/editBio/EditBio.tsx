import css from '../EditProfileInfo.module.css';
import { TextField } from '@mui/material';
import { MAX_BIO_LENGTH } from '../../../../../utils/misc/constants';
import { IEditProfileState } from '../../EditProfile';

interface IEditBioProps {
  state: string;
  setState: (s: IEditProfileState) => void | undefined;
  bioError: string | undefined;
  setBioError: (e: string | undefined) => void;
  isSaving: boolean;
}

export const EditBio: React.FC<IEditBioProps> = (props) => {
  return (
    <TextField
      value={props.state}
      onChange={(e) => props.setState({ bio: e.target.value })}
      error={props.bioError !== undefined}
      helperText={props.bioError}
      label="About me"
      type="text"
      autoComplete="off"
      inputProps={{
        maxLength: MAX_BIO_LENGTH,
      }}
      multiline
      className={css.aboutMe}
      disabled={props.isSaving}
    />
  );
};
