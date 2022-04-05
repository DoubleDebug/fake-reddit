// FIREBASE
import { firebaseConfig } from './utils/firebase/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth } from '@firebase/auth';
import {
    DocumentReference,
    getFirestore,
    Timestamp,
    doc,
    setDoc,
} from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';

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
    const [userData] = useDocumentDataOnce<IUserData>(
        doc(
            db,
            DB_COLLECTIONS.USERS,
            user ? user.uid : 'ERROR_NO_USER'
        ) as DocumentReference<IUserData>
    );

    useEffect(() => {
        if (!user) return;

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
                </Switch>
            </UserContext.Provider>
        </BrowserRouter>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
