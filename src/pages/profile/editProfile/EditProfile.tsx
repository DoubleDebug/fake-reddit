import css from './EditProfile.module.css';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab, ThemeProvider } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { myTheme } from '../../../utils/muiThemes/myTheme';
import { EditAccount } from './editAccount/EditAccount';
import { EditProfileInfo } from './editProfileInfo/EditProfileInfo';
import { Redirect, useParams } from 'react-router-dom';
import { UserDataContext } from '../../../context/UserDataContext';
import { UserContext } from '../../../context/UserContext';
import { ImageUploaderState } from '../../../components/newPost/imageUploader/ImageUploader';
import { useTimeout } from '../../../utils/hooks/useTimeout';
import { DeleteModal } from '../../../components/modals/deleteModal/DeleteModal';
import { deleteAccount } from '../../../utils/firebase/deleteAccount';
import { useQuery } from '../../../utils/hooks/useQuery';

export interface IEditAccountState {
    email?: string;
    verificationStage?: 'init' | 'in progress' | 'sent';
    oldPassword?: string;
    newPassword?: string;
    displayName?: string;
    imageUploader?: ImageUploaderState;
    photoURL?: string;
}

export interface IEditProfileState {
    username?: string;
    bio?: string;
    hideNSFW?: boolean;
}

export const EditProfile: React.FC = () => {
    const user = useContext(UserContext);
    const userData = useContext(UserDataContext);
    const query = useQuery();
    const { username } = useParams<{ username: string }>();
    const [tab, setTab] = useState<'account' | 'profile'>(
        query.get('redirect') === 'updatedProfile' ? 'profile' : 'account'
    );
    const [accountState, setAccountState] = useState<IEditAccountState>();
    const [profileState, setProfileState] = useState<IEditProfileState>();
    const isMounted = useTimeout();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        document.title = `Customize profile | Fake Reddit`;
    }, []);

    if (isMounted && (user === null || userData?.username !== username)) {
        return <Redirect to="/" />;
    }

    return (
        <div className={css.mainContainer}>
            {showDeleteModal && user && (
                <DeleteModal
                    itemBeingDeleted="account"
                    showStateHandler={setShowDeleteModal}
                    action={async () => {
                        await deleteAccount(user);
                        window.location.href = `/?redirect=accountDeleted`;
                    }}
                />
            )}
            <div className={`contentBox ${css.box}`}>
                <h1 className={css.title}>Customize profile</h1>
                <ThemeProvider theme={myTheme}>
                    <TabContext value={tab}>
                        <div className={css.container}>
                            <TabList
                                onChange={(_, val) => setTab(val)}
                                className={css.tabs}
                                orientation="vertical"
                            >
                                <Tab value="account" label="account" />
                                <Tab value="profile" label="profile" />
                            </TabList>
                            <TabPanel value="account" className={css.tab}>
                                <EditAccount
                                    initState={accountState}
                                    saveStateCallback={(s) =>
                                        setAccountState({
                                            ...accountState,
                                            ...s,
                                        })
                                    }
                                    setShowDeleteModal={setShowDeleteModal}
                                />
                            </TabPanel>
                            <TabPanel value="profile" className={css.tab}>
                                <EditProfileInfo
                                    initState={profileState}
                                    saveStateCallback={(s) =>
                                        setProfileState({
                                            ...profileState,
                                            ...s,
                                        })
                                    }
                                />
                            </TabPanel>
                        </div>
                    </TabContext>
                </ThemeProvider>
            </div>
        </div>
    );
};
