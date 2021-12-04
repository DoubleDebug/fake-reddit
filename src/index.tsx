import './index.css';
import { firebaseConfig } from './utils/firebaseConfig';
import { initializeApp } from 'firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Header } from './components/header/Header';
import { Home } from './pages/home/Home';
import { NewPost } from './pages/newPost/newPost';

initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore();

function App() {
    const [user, loading] = useAuthState(auth);
    return (
        <BrowserRouter>
            <Header
                auth={auth}
                firestore={firestore}
                user={user}
                loadingUser={loading}
            />
            <Switch>
                <Route exact path="/">
                    <Home user={user} firestore={firestore} />
                </Route>
                <Route path="/NewPost">
                    <NewPost user={user} firestore={firestore} />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
