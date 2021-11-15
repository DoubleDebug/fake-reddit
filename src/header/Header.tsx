import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Home } from '../home/Home';
import { NewPost } from '../newPost/newPost';
import './Header.css';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User,
    onAuthStateChanged,
} from 'firebase/auth';

export const Header: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const auth = getAuth();

    onAuthStateChanged(auth, (userInfo) => {
        if (userInfo) {
            setUser(userInfo);
        }
    });

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                setUser(result.user);
                console.log(user);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const signOutUser = () => {
        signOut(auth).then(() => {
            setUser(null);
        });
    };

    return (
        <BrowserRouter>
            <div className="header">
                <Link className="headerLink" to="/">
                    Home page
                </Link>
                <Link className="headerLink" to="/newPost">
                    Create post
                </Link>

                {user ? (
                    <div className="flex">
                        <p>{user.displayName}</p>
                        <a
                            className="headerLink"
                            href="#"
                            onClick={signOutUser}
                        >
                            Log out
                        </a>
                    </div>
                ) : (
                    <a
                        className="headerLink"
                        href="#"
                        onClick={signInWithGoogle}
                    >
                        Log in
                    </a>
                )}
            </div>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route path="/NewPost">
                    <NewPost />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};
