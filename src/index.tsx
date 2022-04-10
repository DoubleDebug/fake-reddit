// FIREBASE
import { firebaseConfig } from './utils/firebase/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth } from '@firebase/auth';
import {
    getFirestore,
    Timestamp,
    doc,
    setDoc,
    getDoc,
} from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

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

// OTHER
import './index.css';
import { UserContext } from './context/UserContext';
import { DB_COLLECTIONS } from './utils/misc/constants';
import { maintainLocalStorage } from './utils/misc/maintainLocalStorage';

maintainLocalStorage();

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const App: React.FC = () => {
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (!user) return;
        // update 'last online' field
        getDoc(doc(db, DB_COLLECTIONS.USERS, user.uid))
            .then((res) => res.data())
            .then((userData) => {
                const userRef = doc(db, DB_COLLECTIONS.USERS, user.uid);
                setDoc(userRef, {
                    ...userData,
                    lastOnline: Timestamp.now(),
                });
            });
        // eslint-disable-next-line
    }, [user]);

    return (
        <BrowserRouter>
            <UserContext.Provider value={user}>
                <Header />
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/r/:id">
                        <Subreddit />
                    </Route>
                    <Route path="/newPost">
                        <NewPost />
                    </Route>
                    <Route exact path="/inbox">
                        <Inbox />
                    </Route>
                    <Route path="/inbox/:id">
                        <Inbox />
                    </Route>
                    <Route path="/post/:id">
                        <ViewPost />
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
                </Switch>
            </UserContext.Provider>
        </BrowserRouter>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
