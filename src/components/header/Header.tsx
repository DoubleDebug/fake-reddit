import styles from './Header.module.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '../../utils/dropdown/Dropdown';
import {
    DEFAULT_USER_AVATAR_URL,
    HEADER_SVG_PATH,
    HEADER_SVG_VIEWBOX,
} from '../../utils/misc/constants';
import { Toaster } from 'react-hot-toast';
import { signInWithGoogle, signOutUser } from './HeaderActions';

interface IHeaderProps {
    user: User | undefined | null;
    userData: IUserData;
    loadingUser: boolean;
}

export const Header: React.FC<IHeaderProps> = (props) => {
    const [photoURL, setPhotoURL] = useState(DEFAULT_USER_AVATAR_URL);

    useEffect(() => {
        if (props.user?.photoURL) setPhotoURL(props.user.photoURL);
    }, [props.user]);

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

            {props.user ? (
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
                            {props.user.displayName}
                        </p>
                    </div>
                    <Dropdown
                        items={[
                            {
                                text: 'Log out',
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
                    Log in
                </button>
            )}
        </div>
    );
};
