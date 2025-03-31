import css from './EditProfileInfo.module.css';
import { EditBio } from './editBio/EditBio';
import { useContext, useState } from 'react';
import { IEditProfileState } from '../EditProfile';
import { EditUsername } from './editUsername/EditUsername';
import { FormControlLabel, Checkbox } from '@mui/material';
import { UserContext } from '../../../../context/UserContext';
import { UserDataContext } from '../../../../context/UserDataContext';
import { ButtonSaveChanges } from './buttonSaveChanges/ButtonSaveChanges';

interface IEditProfileInfoProps {
  initState: IEditProfileState | undefined;
  saveStateCallback: (s: IEditProfileState) => void | undefined;
}

export const EditProfileInfo: React.FC<IEditProfileInfoProps> = (props) => {
  const user = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [bioError, setBioError] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);
  const [updatedUsername, setUpdatedUsername] = useState<string | undefined>();

  if (updatedUsername) {
    window.location.href = `/user/${updatedUsername}?edit=true&redirect=updatedProfile`;
  }

  return (
    <form className={css.container}>
      <h2 className={css.title}>Profile settings</h2>
      <EditUsername
        state={props.initState?.username ?? userData?.username ?? ''}
        setState={props.saveStateCallback}
        usernameError={usernameError}
        setUsernameError={setUsernameError}
        isSaving={isSaving}
      />
      <EditBio
        state={props.initState?.bio ?? userData?.bio ?? ''}
        setState={props.saveStateCallback}
        bioError={bioError}
        setBioError={setBioError}
        isSaving={isSaving}
      />
      <div className={css.split}>
        <FormControlLabel
          className={css.checkboxLabel}
          control={
            <Checkbox
              disabled={isSaving}
              checked={props.initState?.hideNSFW ?? userData?.hideNSFW ?? false}
              onChange={(e) =>
                props.saveStateCallback({
                  hideNSFW: e.target.checked,
                })
              }
            />
          }
          label="Hide NSFW posts"
        />
        <ButtonSaveChanges
          user={user}
          userData={userData}
          initState={props.initState}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
          setBioError={setBioError}
          setUpdatedUsername={setUpdatedUsername}
          setUsernameError={setUsernameError}
        />
      </div>
    </form>
  );
};
