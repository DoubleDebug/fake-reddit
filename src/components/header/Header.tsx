import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Home } from '../../pages/home/Home';
import { NewPost } from '../../pages/newPost/newPost';
import './Header.css';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User,
    onAuthStateChanged,
    getAuth,
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
                <Link to="/">Home page</Link>
                <Link to="/newPost">Create post</Link>
                <p> | </p>

                {user ? (
                    <div className="header">
                        <p>{user.displayName}</p>
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
            <Switch>
                <Route exact path="/">
                    <Home {...auth} />
                </Route>
                <Route path="/NewPost">
                    <NewPost {...auth} />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};
