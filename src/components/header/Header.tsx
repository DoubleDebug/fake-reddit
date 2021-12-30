import styles from './Header.module.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    Auth,
    User,
} from 'firebase/auth';
import { Firestore } from '@firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '../../utils/dropdown/Dropdown';
import { UserData } from '../..';
import {
    DEFAULT_USER_AVATAR_URL,
    HEADER_SVG_PATH,
    HEADER_SVG_VIEWBOX,
} from '../../utils/constants';

interface IHeaderProps {
    auth: Auth;
    user: User | undefined | null;
    userData: UserData;
    loadingUser: boolean;
    firestore: Firestore;
}

export const Header: React.FC<IHeaderProps> = (props) => {
    const [profileImageURL, setProfileImageURL] = useState(
        DEFAULT_USER_AVATAR_URL
    );
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(props.auth, provider).catch((error) => {
            console.error(error);
        });
    };

    const signOutUser = () => {
        signOut(props.auth);
    };

    useEffect(() => {
        if (props.user?.photoURL) setProfileImageURL(props.user.photoURL);
    }, [props.user]);

    return (
        <div className={styles.header}>
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
                                action: signOutUser,
                            },
                        ]}
                    >
                        <img
                            className={styles.imgAvatar}
                            src={profileImageURL}
                            alt="User profile"
                        />
                    </Dropdown>
                </div>
            ) : (
                <button
                    className={'btn ' + styles.btnLogin}
                    onClick={signInWithGoogle}
                >
                    Log in
                </button>
            )}
        </div>
    );
};
