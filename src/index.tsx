import ReactDOM from 'react-dom';
import './index.css';
import { Header } from './components/header/Header';
import { getFirestore } from 'firebase/firestore';
import {
    FirebaseAppProvider,
    FirestoreProvider,
    useFirebaseApp,
} from 'reactfire';
import { firebaseConfig } from './utils/firebaseConfig';

function App() {
    const firestoreInstance = getFirestore(useFirebaseApp());
    return (
        <FirestoreProvider sdk={firestoreInstance}>
            <Header />
        </FirestoreProvider>
    );
}

ReactDOM.render(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <App />
    </FirebaseAppProvider>,
    document.getElementById('root')
);
