import css from './Profile.module.css';
import useScrollPosition from '@react-hook/window-scroll';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { ThemeProvider, Tab } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { SavedPostFeed } from '../../../components/feed/savedPostFeed/SavedPostFeed';
import { UserCommentsFeed } from '../../../components/feed/userCommentsFeed/UserCommentsFeed';
import { UserPostFeed } from '../../../components/feed/userPostFeed/UserPostFeed';
import { ReportModal } from '../../../components/modals/reportModal/ReportModal';
import { UserDataContext } from '../../../context/UserDataContext';
import { tabsTheme } from '../../newPost/selectFlairs/SelectFlairsStyles';
import { getUserData } from './ProfileActions';
import { ProfileCard } from '../profileCard/ProfileCard';

export const Profile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const myUserData = useContext(UserDataContext);
    const windowScrollY = useScrollPosition(200);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [userData, setUserData] = useState<IUserDataWithId>();
    const [userExists, setUserExists] = useState(true);
    const [isProfileMine, setIsProfileMine] = useState(false);
    const [tab, setTab] = useState<'posts' | 'commments' | 'saved'>('posts');
    const [showReportModal, setShowReportModal] = useState(false);

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
        if (!myUserData || username === '') return;
        if (myUserData.username === username) {
            setUserData(myUserData);
            setIsProfileMine(true);
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
        return <Redirect to="/" />;
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
                <ThemeProvider theme={tabsTheme}>
                    <TabContext value={tab}>
                        <TabList
                            onChange={(_, val) => setTab(val)}
                            className={css.tabs}
                        >
                            <Tab
                                value="posts"
                                label="posts"
                                className={css.tab}
                            />
                            <Tab
                                value="comments"
                                label="comments"
                                className={css.tab}
                            />
                            {isProfileMine && (
                                <Tab
                                    value="saved"
                                    label="saved"
                                    className={css.tab}
                                />
                            )}
                        </TabList>
                        <TabPanel value="posts">
                            <UserPostFeed uid={userData?.id} />
                        </TabPanel>
                        <TabPanel value="comments">
                            <UserCommentsFeed uid={userData?.id} />
                        </TabPanel>
                        {isProfileMine && (
                            <TabPanel value="saved">
                                <SavedPostFeed postIds={userData?.savedPosts} />
                            </TabPanel>
                        )}
                    </TabContext>
                </ThemeProvider>
            </div>
            <div className={css.profileContainer}>
                <div
                    className={`contentBox ${css.profileFixed}`}
                    ref={containerRef}
                >
                    <ProfileCard
                        data={userData}
                        isProfileMine={isProfileMine}
                        setShowReportModal={setShowReportModal}
                    />
                </div>
            </div>
        </div>
    );
};