import css from './Header.module.css';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '../../utils/dropdown/Dropdown';
import {
  DEFAULT_PROFILE_URL,
  DEFAULT_SUBREDDIT_LOGO_URL,
  HEADER_SVG_PATH,
  HEADER_SVG_PATH_MOBILE,
  HEADER_SVG_VIEWBOX,
} from '../../utils/misc/constants';
import { Toaster } from 'react-hot-toast';
import { signOutUser } from './HeaderActions';
import { UserContext } from '../../context/UserContext';
import { SearchBar } from './searchBar/bar/SearchBar';
import { UserDataContext } from '../../context/UserDataContext';
import { useIsMobile } from '../../utils/hooks/useIsMobile';
import { HeaderContext } from '../../context/HeaderContext';

export const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const user = useContext(UserContext);
  const userData = useContext(UserDataContext);
  const [photoURL, setPhotoURL] = useState(DEFAULT_PROFILE_URL);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);

  useEffect(() => {
    if (user?.photoURL) setPhotoURL(user.photoURL);
  }, [user]);

  return (
    <HeaderContext.Provider
      value={{
        isSearchBarFocused,
        setIsSearchBarFocused,
      }}
    >
      <Toaster />
      {isMobile ? (
        <svg
          className={css.pageBackground}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={HEADER_SVG_VIEWBOX}
          preserveAspectRatio="none"
        >
          <path fill="white" fillOpacity="1" d={HEADER_SVG_PATH_MOBILE}></path>
        </svg>
      ) : (
        <svg
          className={css.pageBackground}
          xmlns="http://www.w3.org/2000/svg"
          viewBox={HEADER_SVG_VIEWBOX}
          preserveAspectRatio="none"
        >
          <path fill="white" fillOpacity="1" d={HEADER_SVG_PATH}></path>
        </svg>
      )}
      <div className={css.header}>
        {(!isMobile || (isMobile && !isSearchBarFocused)) && (
          <div className={css.headerTopRight}>
            <div className={css.logoTopRight}>
              <img
                className={css.headerIcon}
                src={DEFAULT_SUBREDDIT_LOGO_URL}
                alt="Logo"
              />
              <Link to="/" className={css.btnHomepage}>
                FakeReddit
              </Link>
            </div>
          </div>
        )}

        <SearchBar />

        {user
          ? (!isMobile || (isMobile && !isSearchBarFocused)) && (
              <div className={css.headerRightSide}>
                <Link
                  to="/newPost"
                  className={'linkNoUnderline ' + css.linkNewPost}
                >
                  <button className={css.btnNewPost}>
                    <FontAwesomeIcon
                      icon={faPlus}
                      style={{ marginRight: '10px' }}
                    />
                    New post
                  </button>
                </Link>
                {!isMobile && (
                  <div className="flex">
                    <p className={css.lblDisplayName}>{user.displayName}</p>
                  </div>
                )}
                <Dropdown
                  items={[
                    {
                      text: 'Profile',
                      redirectPath: `/user/${userData?.username}`,
                    },
                    {
                      text: 'Inbox',
                      redirectPath: '/inbox',
                    },
                    {
                      text: 'Sign out',
                      action: () => signOutUser(),
                      icon: faSignOutAlt,
                    },
                  ]}
                >
                  <img className={css.imgAvatar} src={photoURL} alt="U" />
                </Dropdown>
              </div>
            )
          : (!isMobile || (isMobile && !isSearchBarFocused)) && (
              <div className="flex">
                <Link to="/login" className={css.link}>
                  <button className={css.btnLogin}>Log in</button>
                </Link>
                <Link to="/signup" className={css.link}>
                  <button className={css.btnLogin}>Sign up</button>
                </Link>
              </div>
            )}
      </div>
    </HeaderContext.Provider>
  );
};
