// FIREBASE
import { firebaseConfig } from './utils/firebase/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth } from '@firebase/auth';
import {
    getFirestore,
    Timestamp,
    doc,
    setDoc,
    DocumentReference,
} from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { connectFirestoreEmulator } from 'firebase/firestore';

// REACT
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// PAGES & COMPONENTS
import { Header } from './components/header/Header';
import { Subreddit } from './pages/subreddit/Subreddit';
import { NewPost } from './pages/newPost/NewPost';
import { ViewPost } from './pages/viewPost/ViewPost';
import { Home } from './pages/home/Home';
import { Inbox } from './pages/inbox/Inbox';
import { LoginForm } from './pages/login/LoginForm';
import { ResetPassword } from './pages/login/resetPassword/ResetPassword';
import { UserProfile } from './pages/profile/UserProfile';
import { NewSubreddit } from './pages/newSubreddit/NewSubreddit';

// OTHER
import './index.css';
import {
    DB_COLLECTIONS,
    DB_HOSTNAME,
    DB_PORT,
    PRODUCTION_MODE,
} from './utils/misc/constants';
import { UserContext } from './context/UserContext';
import { UserDataContext } from './context/UserDataContext';
import { maintainLocalStorage } from './utils/misc/maintainLocalStorage';
import { log } from './utils/misc/log';

maintainLocalStorage();

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
if (!PRODUCTION_MODE) {
    connectFirestoreEmulator(db, DB_HOSTNAME, DB_PORT);
    log('Running in development mode.');
}

const App: React.FC = () => {
    const [user] = useAuthState(auth);
    const [userData] = useDocumentDataOnce(
        user &&
            (doc(db, DB_COLLECTIONS.USERS, user.uid) as DocumentReference<
                IUserDataWithId | undefined
            >),
        {
            idField: 'id',
        }
    );

    useEffect(() => {
        if (!user || !userData) return;
        // update 'last online' field
        const userRef = doc(db, DB_COLLECTIONS.USERS, user.uid);
        setDoc(userRef, {
            ...userData,
            lastOnline: Timestamp.now(),
        });
    }, [user, userData]);

    return (
        <BrowserRouter>
            <UserContext.Provider value={user}>
                <UserDataContext.Provider value={userData}>
                    <Header />
                </UserDataContext.Provider>
                <Switch>
                    <Route exact path="/">
                        <UserDataContext.Provider value={userData}>
                            <Home />
                        </UserDataContext.Provider>
                    </Route>
                    <Route path="/r/:id">
                        <UserDataContext.Provider value={userData}>
                            <Subreddit />
                        </UserDataContext.Provider>
                    </Route>
                    <Route path="/newPost">
                        <NewPost />
                    </Route>
                    <Route exact path="/inbox">
                        <Inbox />
                    </Route>
                    <Route path="/inbox/:roomId">
                        <Inbox />
                    </Route>
                    <Route path="/post/:id">
                        <UserDataContext.Provider value={userData}>
                            <ViewPost />
                        </UserDataContext.Provider>
                    </Route>
                    <Route exact path="/login">
                        <LoginForm tab="log in" />
                    </Route>
                    <Route path="/signup">
                        <LoginForm tab="sign up" />
                    </Route>
                    <Route path="/login/resetPassword">
                        <ResetPassword />
                    </Route>
                    <Route path="/user/:username">
                        <UserDataContext.Provider value={userData}>
                            <UserProfile />
                        </UserDataContext.Provider>
                    </Route>
                    <Route path="/newSubreddit">
                        <UserDataContext.Provider value={userData}>
                            <NewSubreddit />
                        </UserDataContext.Provider>
                    </Route>
                </Switch>
            </UserContext.Provider>
        </BrowserRouter>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
