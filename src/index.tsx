// FIREBASE
import { firebaseConfig } from './utils/firebase/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore, setDoc, Timestamp } from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc } from 'firebase/firestore';

// REACT
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// PAGES & COMPONENTS
import { Header } from './components/header/Header';
import { Subreddit } from './pages/subreddit/Subreddit';
import { NewPost } from './pages/newPost/NewPost';
import { ViewPost } from './pages/viewPost/ViewPost';
import { Home } from './pages/home/Home';
import { Chat } from './pages/chat/Chat';

// OTHER
import './index.css';
import { DB_COLLECTIONS } from './utils/constants';

initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();

function App() {
    const [user, loading] = useAuthState(auth);
    const [userData, setUserData] = useState<IUserData>({
        lastOnline: Timestamp.now(),
    });

    useEffect(() => {
        if (!user) return;

        // add user data to firestore
        const userRef = doc(firestore, DB_COLLECTIONS.USERS, user.uid);
        const userData = {
            lastOnline: Timestamp.now(),
        };
        setDoc(userRef, userData);
        setUserData(userData);
    }, [user]);

    return (
        <BrowserRouter>
            <Header
                auth={auth}
                firestore={firestore}
                user={user}
                userData={userData}
                loadingUser={loading}
            />
            <Switch>
                <Route exact path="/">
                    <Home user={user} firestore={firestore} />
                </Route>
                <Route path="/r/:id">
                    <Subreddit user={user} firestore={firestore}></Subreddit>
                </Route>
                <Route path="/newPost">
                    <NewPost user={user} firestore={firestore} />
                </Route>
                <Route path="/chat/:id">
                    <Chat user={user} firestore={firestore}></Chat>
                </Route>
                <Route path="/post/:id">
                    <ViewPost user={user} firestore={firestore}></ViewPost>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
