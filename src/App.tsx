// FIREBASE
import {
  Timestamp,
  doc,
  setDoc,
  DocumentReference,
  getFirestore,
  connectFirestoreEmulator,
} from '@firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from '@firebase/auth';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';

// REACT
import { FC, useEffect } from 'react';

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

// ROUTING
import { routeTree } from './routeTree.gen';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { log } from './utils/misc/log';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './utils/firebase/firebaseConfig';

const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// DATABASE
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
if (!PRODUCTION_MODE) {
  connectFirestoreEmulator(db, DB_HOSTNAME, DB_PORT);
  log('Running in development mode.');
}

export const App: FC = () => {
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
