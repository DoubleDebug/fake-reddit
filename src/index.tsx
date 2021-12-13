import './index.css';
import { firebaseConfig } from './utils/firebase/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore, setDoc, Timestamp } from '@firebase/firestore';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Header } from './components/header/Header';
import { Home } from './pages/home/Home';
import { NewPost } from './pages/newPost/newPost';
import { Chat } from './pages/chat/Chat';
import { useEffect, useState } from 'react';
import { doc } from 'firebase/firestore';

initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();

export interface UserData {
    photoURL: string | undefined | null;
    lastOnline: Timestamp;
}

function App() {
    const [user, loading] = useAuthState(auth);
    const [userData, setUserData] = useState<UserData>({
        photoURL: null,
        lastOnline: Timestamp.now(),
    });

    useEffect(() => {
        if (!user) return;

        // add user data to firestore
        const userRef = doc(firestore, 'users', user.uid);
        const userData = {
            photoURL: user.photoURL,
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
                <Route path="/newPost">
                    <NewPost user={user} firestore={firestore} />
                </Route>
                <Route path="/chat">
                    <Chat user={user} firestore={firestore}></Chat>
                </Route>
                user
            </Switch>
        </BrowserRouter>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
