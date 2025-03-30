import { FC, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { Outlet } from '@tanstack/react-router';
import { Header } from '../components/header/Header';
import { UserContext } from '../context/UserContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  DB_COLLECTIONS,
  DB_HOSTNAME,
  DB_PORT,
  PRODUCTION_MODE,
} from '../utils/misc/constants';
import { UserDataContext } from '../context/UserDataContext';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import {
  connectFirestoreEmulator,
  doc,
  DocumentReference,
  getFirestore,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../utils/firebase/firebaseConfig';
import { log } from '../utils/misc/log';
import { UserConverter } from '../models/user';

// DATABASE
initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
if (!PRODUCTION_MODE) {
  connectFirestoreEmulator(db, DB_HOSTNAME, DB_PORT);
  log('Running in development mode.');
}

export const RootPage: FC = () => {
  const [user] = useAuthState(auth);
  const [userData] = useDocumentDataOnce(
    user &&
      (
        doc(db, DB_COLLECTIONS.USERS, user.uid) as DocumentReference<
          IUserDataWithId | undefined
        >
      ).withConverter(UserConverter),
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
      <UserDataContext.Provider value={userData as IUserDataWithId}>
        <Header />
        <Outlet />
      </UserDataContext.Provider>
    </UserContext.Provider>
  );
};
