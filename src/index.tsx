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
import { createRoot } from 'react-dom/client';

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

// ROUTING
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

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
    <UserContext.Provider value={user}>
      <UserDataContext.Provider value={userData}>
        <RouterProvider router={router} />
      </UserDataContext.Provider>
    </UserContext.Provider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
