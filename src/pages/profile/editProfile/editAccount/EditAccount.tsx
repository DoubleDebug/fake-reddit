import css from './EditAccount.module.css';
import { IEditAccountState } from '../EditProfile';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../context/UserContext';
import { EditEmail } from './editEmail/EditEmail';
import { EditPassword } from './editPassword/EditPassword';
import { EditDisplayName } from './editDisplayName/EditDisplayName';
import { ImageUploader } from '../../../../components/newPost/imageUploader/ImageUploader';
import {
    DEFAULT_PROFILE_URL,
    STORAGE_FOLDERS,
} from '../../../../utils/misc/constants';
import Skeleton from 'react-loading-skeleton';
import { UserDataContext } from '../../../../context/UserDataContext';
import { getUserProvider } from '../../../../utils/firebase/getUserProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { handleSaveChanges } from '../EditProfileActions';
import { useLocation } from 'react-router-dom';
import { displayNotif } from '../../../../utils/misc/toast';

interface IEditAccountProps {
    initState: IEditAccountState | undefined;
    saveStateCallback: (s: IEditAccountState) => void | undefined;
}

export const EditAccount: React.FC<IEditAccountProps> = (props) => {
    const user = useContext(UserContext);
    const userData = useContext(UserDataContext);
    const location = useLocation();
    const [displayNameError, setDisplayNameError] = useState<
        string | undefined
    >();
    const [emailError, setEmailError] = useState<string | undefined>();
    const [userProvider, setUserProvider] = useState<
        'google' | 'github' | 'password'
    >('password');
    const [submittingStage, setSubmittingStage] = useState<
        'init' | 'in progress' | 'done'
    >();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        setIsLoading(false);
        setUserProvider(getUserProvider(user));
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get('redirect') === 'updatedAccount') {
            displayNotif('Updated account information.', 'success');
        }
        // eslint-disable-next-line
    }, []);

    if (submittingStage === 'done') {
        // force refresh when account data is updated
        window.location.href = `${location.pathname}?redirect=updatedAccount`;
    }

    return (
        <div className={css.container}>
            <h2 className={css.title}>Account settings</h2>
            <div className={css.userInfo}>
                {user ? (
                    <img
                        className={css.avatar}
                        alt={user.displayName || userData?.username}
                        src={user.photoURL || DEFAULT_PROFILE_URL}
                    />
                ) : (
                    <Skeleton circle className={css.avatar} />
                )}
                <div className={css.nameAndEmail}>
                    {user ? (
                        <strong>{user.displayName}</strong>
                    ) : (
                        <Skeleton width={100} />
                    )}
                    {user ? (
                        <small>{user.email}</small>
                    ) : (
                        <Skeleton width={200} />
                    )}
                </div>
            </div>
            <EditPassword
                isLoading={isLoading}
                userProvider={userProvider}
                state={{
                    oldPassword: props.initState?.oldPassword || '',
                    newPassword: props.initState?.newPassword || '',
                }}
                handleNewState={(s) => props.saveStateCallback(s)}
                setSubmittingStage={setSubmittingStage}
            />
            <EditEmail
                emailError={emailError}
                isLoading={isLoading}
                state={{
                    email: props.initState?.email ?? user?.email ?? '',
                    verificationStage:
                        props.initState?.verificationStage || 'init',
                }}
                handleNewState={(s) => props.saveStateCallback(s)}
            />
            <EditDisplayName
                displayNameError={displayNameError}
                isLoading={isLoading}
                state={{
                    displayName:
                        props.initState?.displayName ?? user?.displayName ?? '',
                }}
                handleNewState={(s) => props.saveStateCallback(s)}
            />
            <div className={css.imageContainer}>
                <ImageUploader
                    state={props.initState?.imageUploader}
                    handleNewState={(s) =>
                        props.saveStateCallback({
                            imageUploader: s,
                            photoURL:
                                s.uploadedFiles.length === 1
                                    ? s.uploadedFiles[0].url
                                    : undefined,
                        })
                    }
                    handleContentUpdate={() => {}}
                    noVideos
                    noMultipleFiles
                    differentStoragePath={STORAGE_FOLDERS.USER_AVATARS}
                />
            </div>
            <div style={{ position: 'relative' }}>
                <p className={css.groupLabel}>Avatar</p>
            </div>
            <button
                disabled={submittingStage === 'in progress'}
                className={css.btnSubmit}
                type="submit"
                onClick={(e) =>
                    handleSaveChanges(
                        e,
                        user,
                        setSubmittingStage,
                        props.initState?.email ?? user?.email ?? '',
                        props.initState?.displayName ?? user?.displayName ?? '',
                        props.initState?.photoURL ?? user?.photoURL ?? '',
                        setEmailError,
                        setDisplayNameError
                    )
                }
            >
                {submittingStage === 'in progress' ? (
                    <FontAwesomeIcon
                        icon={faCircleNotch}
                        spin
                        style={{ margin: '0 1.5rem' }}
                    />
                ) : (
                    'Save changes'
                )}
            </button>
        </div>
    );
};
