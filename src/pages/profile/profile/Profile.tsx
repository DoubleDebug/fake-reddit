import css from './Profile.module.css';
import useScrollPosition from '@react-hook/window-scroll';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ThemeProvider, Tab } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { SavedPostFeed } from '../../../components/feed/savedPostFeed/SavedPostFeed';
import { UserCommentsFeed } from '../../../components/feed/userCommentsFeed/UserCommentsFeed';
import { UserPostFeed } from '../../../components/feed/userPostFeed/UserPostFeed';
import { ReportModal } from '../../../components/modals/reportModal/ReportModal';
import { UserDataContext } from '../../../context/UserDataContext';
import { myTheme } from '../../../utils/muiThemes/myTheme';
import { getUserData } from './ProfileActions';
import { ProfileCard } from '../profileCard/ProfileCard';
import { IFeedState } from '../../home/Home';
import { useIsMobile } from '../../../utils/hooks/useIsMobile';
import { Route } from '../../../routes/user.$username';
import { Navigate } from '@tanstack/react-router';

export const Profile: React.FC = () => {
  const { username } = Route.useParams();
  const myUserData = useContext(UserDataContext);
  const windowScrollY = useScrollPosition(200);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [userData, setUserData] = useState<IUserDataWithId>();
  const [userExists, setUserExists] = useState(true);
  const [isProfileMine, setIsProfileMine] = useState(false);
  const [tab, setTab] = useState<'posts' | 'commments' | 'saved'>('posts');
  const [showReportModal, setShowReportModal] = useState(false);
  const [userPostsState, setUserPostsState] = useState<IFeedState>();
  const [userCommentsState, setUserCommentsState] = useState<IFeedState>();
  const [savedPostsState, setSavedPostsState] = useState<IFeedState>();
  const [firstLoad, setFirstLoad] = useState({
    posts: true,
    comments: true,
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    // update profile card position
    if (!containerRef.current) return;
    const initialTop = 187;
    if (windowScrollY > initialTop) {
      containerRef.current.style.top = `0px`;
    } else {
      containerRef.current.style.top = `${initialTop - windowScrollY}px`;
    }
  }, [windowScrollY]);

  useEffect(() => {
    if (username === '') {
      setUserExists(false);
      return;
    }
    if (myUserData?.username === username) {
      setUserData(myUserData);
      setIsProfileMine(true);
      return;
    }

    getUserData(username)
      .then((data) => {
        if (!data) {
          setUserExists(false);
          return;
        }
        setUserData(data);

        document.title = `${data.username} | Fake Reddit`;
      })
      .catch(() => setUserExists(false));
  }, [myUserData, username]);

  if (!userExists) {
    return <Navigate to="/" />;
  }

  return (
    <div className={css.container}>
      {showReportModal && (
        <ReportModal
          type="user"
          contentId={userData?.id || ''}
          showStateHandler={setShowReportModal}
        />
      )}
      <div className={`contentBox ${css.feedContainer}`}>
        {isMobile && (
          <div className={`${css.profileContainerMobile}`}>
            <div className={`${css.profileMobile}`} ref={containerRef}>
              <ProfileCard
                data={userData}
                isProfileMine={isProfileMine}
                setShowReportModal={setShowReportModal}
              />
            </div>
          </div>
        )}
        <ThemeProvider theme={myTheme}>
          <TabContext value={tab}>
            <TabList
              onChange={(_, val) => {
                setTab(val);
                if (val === 'posts')
                  setFirstLoad({
                    ...firstLoad,
                    comments: false,
                  });
                else
                  setFirstLoad({
                    ...firstLoad,
                    posts: false,
                  });
              }}
              className={css.tabs}
            >
              <Tab value="posts" label="posts" className={css.tab} />
              <Tab value="comments" label="comments" className={css.tab} />
              {isProfileMine && (
                <Tab value="saved" label="saved" className={css.tab} />
              )}
            </TabList>
            <TabPanel value="posts">
              <UserPostFeed
                firstLoad={firstLoad.posts}
                username={username}
                initState={userPostsState}
                saveStateCallback={setUserPostsState}
              />
            </TabPanel>
            <TabPanel value="comments">
              <UserCommentsFeed
                firstLoad={firstLoad.comments}
                username={username}
                initState={userCommentsState}
                saveStateCallback={setUserCommentsState}
              />
            </TabPanel>
            {isProfileMine && (
              <TabPanel value="saved">
                <SavedPostFeed
                  initState={savedPostsState}
                  saveStateCallback={setSavedPostsState}
                />
              </TabPanel>
            )}
          </TabContext>
        </ThemeProvider>
      </div>
      {!isMobile && (
        <div className={css.profileContainer}>
          <div className={`contentBox ${css.profileFixed}`} ref={containerRef}>
            <ProfileCard
              data={userData}
              isProfileMine={isProfileMine}
              setShowReportModal={setShowReportModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};
