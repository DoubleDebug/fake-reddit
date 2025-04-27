import css from './ProfileSettings.module.css';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab, ThemeProvider, useMediaQuery } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { myTheme, theme_color } from '../../../utils/muiThemes/myTheme';
import { UserDataContext } from '../../../context/UserDataContext';
import { UserContext } from '../../../context/UserContext';
import { ImageUploaderState } from '../../../components/newPost/imageUploader/ImageUploader';
import { useTimeout } from '../../../utils/hooks/useTimeout';
import { DeleteModal } from '../../../components/modals/deleteModal/DeleteModal';
import { deleteAccount } from '../../../utils/firebase/deleteAccount';
import { logEvent, getAnalytics } from 'firebase/analytics';
import { ANALYTICS_EVENTS } from '../../../utils/misc/constants';
import { Navigate } from '@tanstack/react-router';
import { Route } from '../../../routes/user.$username';

export interface IProfileSettingsState {
  theme_color?: string;
}

export interface IEditAccountState {
  handleNewState: (s: IProfileSettingsState) => void;
}



export const ProfileSettings: React.FC = (props) => {
  const user = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const isMobile = useMediaQuery('(max-width: 850px)');
  const { username } = Route.useParams();
  const { redirect: searchParamRedirect } = Route.useSearch();
  const [tab, setTab] = useState<'account' | 'profile'>(
    searchParamRedirect === 'updatedProfile' ? 'profile' : 'account',
  );4
  const isMounted = useTimeout();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    document.title = `Customize experience | Moj Reddit`;
  }, []);

  if (isMounted && (user === null || userData?.username !== username)) {
    return <Navigate to="/" />;
  }

  let new_theme_color;

  return (
    <div className={css.mainContainer}>
      {showDeleteModal && user && (
        <DeleteModal
          itemBeingDeleted="account"
          showStateHandler={setShowDeleteModal}
          action={async () => {
            logEvent(getAnalytics(), ANALYTICS_EVENTS.DELETE_ACCOUNT);
            await deleteAccount(user);
            window.location.href = `/?redirect=accountDeleted`;
          }}
        />
      )}
      <div className={`contentBox ${css.box}`}>
        <h1 className={css.title}>Customize experience </h1>
        <ThemeProvider theme={myTheme}>
          <TabContext value={tab}>
            <div className={css.container}>
            <label className={css.title}> Header color </label>
            <input type="color" id="head" name="head" 
            value={new_theme_color}
            onChange={(e) => use: e.target.value })}
            ></input> {theme_color}
            </div>
          </TabContext>
        </ThemeProvider>
      </div>
    </div>
  );
};
