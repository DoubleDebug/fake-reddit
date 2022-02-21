import styles from './Header.module.css';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '../../utils/dropdown/Dropdown';
import {
    DEFAULT_PROFILE_URL,
    HEADER_SVG_PATH,
    HEADER_SVG_VIEWBOX,
} from '../../utils/misc/constants';
import { Toaster } from 'react-hot-toast';
import { signInWithGoogle, signOutUser } from './HeaderActions';
import { UserContext } from '../../context/UserContext';

export const Header: React.FC = () => {
    const user = useContext(UserContext);
    const [photoURL, setPhotoURL] = useState(DEFAULT_PROFILE_URL);

    useEffect(() => {
        if (user?.photoURL) setPhotoURL(user.photoURL);
    }, [user]);

    return (
        <div className={styles.header}>
            <Toaster />
            <svg
                className={styles.pageBackground}
                xmlns="http://www.w3.org/2000/svg"
                viewBox={HEADER_SVG_VIEWBOX}
            >
                <path
                    fill="var(--colorOrange)"
                    fillOpacity="1"
                    d={HEADER_SVG_PATH}
                ></path>
            </svg>

            <div className={styles.headerTopRight}>
                <img className={styles.headerIcon} alt="Logo"></img>
                <Link to="/" className={'btn ' + styles.btnHomepage}>
                    FakeReddit
                </Link>
            </div>

            {user ? (
                <div className="flex">
                    <Link
                        to="/newPost"
                        className={'linkNoUnderline ' + styles.linkNewPost}
                    >
                        <button className={'btn ' + styles.btnNewPost}>
                            <FontAwesomeIcon
                                icon={faPlus}
                                style={{ marginRight: '10px' }}
                            ></FontAwesomeIcon>
                            New post
                        </button>
                    </Link>
                    <div className={styles.header}>
                        <p className={styles.lblDisplayName}>
                            {user.displayName}
                        </p>
                    </div>
                    <Dropdown
                        items={[
                            {
                                text: 'Sign out',
                                action: () => signOutUser(),
                            },
                        ]}
                    >
                        <img
                            className={styles.imgAvatar}
                            src={photoURL}
                            alt="U"
                        />
                    </Dropdown>
                </div>
            ) : (
                <button
                    className={'btn ' + styles.btnLogin}
                    onClick={() => signInWithGoogle()}
                >
                    Sign in
                </button>
            )}
        </div>
    );
};
