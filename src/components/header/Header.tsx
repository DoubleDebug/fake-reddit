import css from './Header.module.css';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '../../utils/dropdown/Dropdown';
import {
    DEFAULT_PROFILE_URL,
    HEADER_SVG_PATH,
    HEADER_SVG_VIEWBOX,
} from '../../utils/misc/constants';
import { Toaster } from 'react-hot-toast';
import { signOutUser } from './HeaderActions';
import { UserContext } from '../../context/UserContext';
import { SearchBar } from './searchBar/bar/SearchBar';
import { UserDataContext } from '../../context/UserDataContext';

export const Header: React.FC = () => {
    const user = useContext(UserContext);
    const userData = useContext(UserDataContext);
    const [photoURL, setPhotoURL] = useState(DEFAULT_PROFILE_URL);

    useEffect(() => {
        if (user?.photoURL) setPhotoURL(user.photoURL);
    }, [user]);

    return (
        <>
            <Toaster />
            <svg
                className={css.pageBackground}
                xmlns="http://www.w3.org/2000/svg"
                viewBox={HEADER_SVG_VIEWBOX}
                preserveAspectRatio="xMidYMax meet"
            >
                <path fill="white" fillOpacity="1" d={HEADER_SVG_PATH}></path>
            </svg>
            <div className={css.header}>
                <div className={css.headerTopRight}>
                    <div className={css.logoTopRight}>
                        <img className={css.headerIcon} alt="Logo"></img>
                        <Link to="/" className={css.btnHomepage}>
                            FakeReddit
                        </Link>
                    </div>
                </div>

                <SearchBar />

                {user ? (
                    <div className="flex">
                        <Link
                            to="/newPost"
                            className={'linkNoUnderline ' + css.linkNewPost}
                        >
                            <button className={css.btnNewPost}>
                                <FontAwesomeIcon
                                    icon={faPlus}
                                    style={{ marginRight: '10px' }}
                                ></FontAwesomeIcon>
                                New post
                            </button>
                        </Link>
                        <div className="flex">
                            <p className={css.lblDisplayName}>
                                {user.displayName}
                            </p>
                        </div>
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
                            <img
                                className={css.imgAvatar}
                                src={photoURL}
                                alt="U"
                            />
                        </Dropdown>
                    </div>
                ) : (
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
        </>
    );
};
