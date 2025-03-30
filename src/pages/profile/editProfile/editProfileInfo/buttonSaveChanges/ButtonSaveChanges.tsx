import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { User } from 'firebase/auth';
import { IEditProfileState } from '../../EditProfile';
import css from '../EditProfileInfo.module.css';
import { handleSaveChanges } from '../EditProfileInfoActions';

interface IButtonSaveChangesProps {
  user: User | null | undefined;
  userData: IUserData | undefined;
  isSaving: boolean;
  setIsSaving: (s: boolean) => void;
  initState: IEditProfileState | undefined;
  setUsernameError: (e: string | undefined) => void;
  setBioError: (e: string | undefined) => void;
  setUpdatedUsername: (u: string | undefined) => void;
}

export const ButtonSaveChanges: React.FC<IButtonSaveChangesProps> = (props) => {
  return (
    <button
      disabled={props.isSaving}
      className={css.btnSaveChanges}
      type="submit"
      onClick={(e) =>
        handleSaveChanges(
          e,
          props.user,
          props.setIsSaving,
          {
            username:
              props.initState?.username ?? props.userData?.username ?? '',
            bio: props.initState?.bio ?? props.userData?.bio ?? '',
            hideNSFW: props.initState?.hideNSFW ? true : false,
          },
          props.setUsernameError,
          props.setBioError,
          props.setUpdatedUsername,
        )
      }
    >
      {props.isSaving ? (
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          style={{ margin: '0 2.8rem' }}
        />
      ) : (
        'Save changes'
      )}
    </button>
  );
};
