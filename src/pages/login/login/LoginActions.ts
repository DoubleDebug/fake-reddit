import { getAnalytics, logEvent } from 'firebase/analytics';
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import {
  validatePassword,
  validateUsername,
} from '../../../utils/dataValidation/validateRegisterForm';
import { getUserEmailByUsername } from '../../../utils/firebase/getUserEmailByUsername';
import { registerUserWithProvider } from '../../../utils/firebase/registerUser';
import { ANALYTICS_EVENTS } from '../../../utils/misc/constants';
import { getErrorMessage } from '../../../utils/misc/getErrorMessage';
import { displayNotif } from '../../../utils/misc/toast';

export function loginWithGoogle() {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((userCred) => {
      const userData = {
        uid: userCred.user.uid,
        name: userCred.user.displayName,
        photoURL: userCred.user.photoURL,
      };
      logEvent(getAnalytics(), ANALYTICS_EVENTS.LOGIN, {
        method: 'Google',
      });
      registerUserWithProvider(
        userData.uid,
        userData.name,
        userData.photoURL,
      ).catch((err) => console.log('User registration failed.', err));

      displayNotif(
        `Welcome to Reddit, ${userData.name}!`,
        'success',
        undefined,
        'bottom-left',
      );
    })
    .catch((error) => {
      const message = getErrorMessage(error);
      displayNotif(message, 'error');
    });
}

export function loginWithGithub() {
  const auth = getAuth();
  const provider = new GithubAuthProvider();
  provider.addScope('read:user');

  signInWithPopup(auth, provider)
    .then((userCred) => {
      const userData = {
        uid: userCred.user.uid,
        name: (userCred.user as any).reloadUserInfo.screenName,
        photoURL: (userCred.user as any).reloadUserInfo.photoUrl,
      };

      logEvent(getAnalytics(), ANALYTICS_EVENTS.LOGIN, {
        method: 'Github',
      });
      registerUserWithProvider(
        userData.uid,
        userData.name,
        userData.photoURL,
      ).catch((err) => console.log('User registration failed.', err));

      displayNotif(
        `Welcome to Reddit, ${userData.name}!`,
        'success',
        undefined,
        'bottom-left',
      );
    })
    .catch((error) => {
      const message = getErrorMessage(error);
      displayNotif(message, 'error');
    });
}

export async function loginWithUsername(
  username: string,
  password: string,
  setUsernameErrorMessage: (e: string) => void,
  setPasswordErrorMessage: (e: string) => void,
  setIsLoading: (l: boolean) => void,
) {
  const validationUsername = validateUsername(username);
  const validationPassword = validatePassword(password);
  if (!validationUsername.isValid) {
    setUsernameErrorMessage('The username is invalid.');
    setIsLoading(false);
    return;
  }
  if (!validationPassword.isValid) {
    setPasswordErrorMessage('The password is invalid');
    setIsLoading(false);
    return;
  }

  const res = await getUserEmailByUsername(username).catch(() => {
    displayNotif('Failed to connect to the server.', 'error');
    setIsLoading(false);
  });
  if (!res) {
    setIsLoading(false);
    return;
  }
  if (res && !res.success) {
    displayNotif(res.message, 'error');
    setIsLoading(false);
    return;
  }

  const email: string = res.data;
  const auth = getAuth();
  const userCred = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  ).catch((err) => {
    displayNotif(getErrorMessage(err), 'error');
    setIsLoading(false);
  });

  if (userCred) {
    logEvent(getAnalytics(), ANALYTICS_EVENTS.LOGIN, {
      method: 'username',
    });
    displayNotif(
      `Welcome to Reddit, ${userCred.user.displayName}!`,
      'success',
      undefined,
      'bottom-left',
    );
    setIsLoading(false);
  }
}
