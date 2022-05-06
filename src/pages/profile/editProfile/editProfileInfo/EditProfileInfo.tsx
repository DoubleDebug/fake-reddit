import css from './EditProfileInfo.module.css';
import { IEditProfileState } from '../EditProfile';

interface IEditProfileInfoProps {
    initState: IEditProfileState | undefined;
    saveStateCallback: (s: IEditProfileState) => void | undefined;
}

export const EditProfileInfo: React.FC<IEditProfileInfoProps> = (props) => {
    return (
        <div className={css.container}>Edit profile{JSON.stringify(props)}</div>
    );
};
