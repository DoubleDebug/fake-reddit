import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User,
    Auth,
} from 'firebase/auth';
import { Firestore } from '@firebase/firestore';
import Skeleton from 'react-loading-skeleton';

interface IHeaderProps {
    auth: Auth;
    user: User | undefined | null;
    loadingUser: boolean;
    firestore: Firestore;
}

export const Header: React.FC<IHeaderProps> = (props) => {
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(props.auth, provider).catch((error) => {
            console.error(error);
        });
    };

    const signOutUser = () => {
        signOut(props.auth);
    };

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
            <Link to="/">Home page</Link>
            <Link to="/newPost">Create post</Link>
            <p> | </p>

            {props.user ? (
                <div className="header">
                    <p>{props.user.displayName}</p>
                    <a href="/#" onClick={signOutUser}>
                        Log out
                    </a>
                </div>
            ) : (
                <a href="/#" onClick={signInWithGoogle}>
                    Log in
                </a>
            )}
        </div>
    );
};
