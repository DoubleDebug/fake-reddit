import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    Auth,
    User,
} from 'firebase/auth';
import { Firestore } from '@firebase/firestore';
import Skeleton from 'react-loading-skeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from '../../utils/dropdown/Dropdown';
import { UserData } from '../..';

export const DEFAULT_USER_AVATAR_URL = 'https://i.imgur.com/gThi9Rl.png';

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

    if (props.loadingUser) {
        return (
            <div className="headerSkeletonContainer">
                <div className="headerSkeleton">
                    <Skeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="header">
            <svg
                className="pageBackground"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 320"
            >
                <path
                    fill="var(--colorOrange)"
                    fillOpacity="1"
                    d="M0,224L48,213.3C96,203,192,181,288,160C384,139,480,117,576,138.7C672,160,768,224,864,229.3C960,235,1056,181,1152,181.3C1248,181,1344,235,1392,261.3L1440,288L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                ></path>
            </svg>

            <Link to="/" className="btn btnHomepage">
                FakeReddit
            </Link>

            {props.user ? (
                <div className="flex">
                    <Link to="/newPost" className="linkNoUnderline linkNewPost">
                        <button className="btn btnNewPost">
                            <FontAwesomeIcon
                                icon={faPlus}
                                style={{ marginRight: '10px' }}
                            ></FontAwesomeIcon>
                            New post
                        </button>
                    </Link>
                    <div className="header">
                        <p className="lblDisplayName">
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
                            className="imgAvatar"
                            src={profileImageURL}
                            alt="User profile"
                        />
                    </Dropdown>
                </div>
            ) : (
                <button className="btn btnLogin" onClick={signInWithGoogle}>
                    Log in
                </button>
            )}
        </div>
    );
};
