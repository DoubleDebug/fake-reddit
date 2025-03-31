import { logEvent, getAnalytics } from 'firebase/analytics';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  User,
} from 'firebase/auth';
import React from 'react';
import {
  validateEmail,
  validatePassword,
} from '../../../utils/dataValidation/validateRegisterForm';
import { updateAccount } from '../../../utils/firebase/updateAccount';
import { ANALYTICS_EVENTS, LS } from '../../../utils/misc/constants';
import { getErrorMessage } from '../../../utils/misc/getErrorMessage';
import { updateCachedData } from '../../../utils/misc/manageLocalStorageData';
import { displayNotif } from '../../../utils/misc/toast';

export async function sendVerificationEmail(
  user: User | null | undefined,
  setVerificationStage: (s: 'init' | 'in progress' | 'sent') => void,
) {
  if (!user) return;

  setVerificationStage('in progress');
  await sendEmailVerification(user)
    .then(() => {
      setVerificationStage('sent');
      displayNotif(`We've sent you an email.`, 'success');
    })
    .catch((error) => {
      console.log(error);
      setVerificationStage('sent');
      displayNotif('Failed to send a verification email.', 'error');
    });
}

/**
 * @returns true if the password was successfully changed
 * or false if there was an error.
 */
export async function changePassword(
  user: User | null | undefined,
  oldPassword: string,
  newPassword: string,
  setOldPasswordError: (e: string) => void,
  setNewPasswordError: (e: string) => void,
): Promise<boolean> {
  // validate input
  if (!user || !user.email) return false;
  const v_old = validatePassword(oldPassword);
  if (!v_old.isValid) {
    setOldPasswordError(v_old.message);
    return false;
  }
  const v_new = validatePassword(newPassword);
  if (!v_new.isValid) {
    setNewPasswordError(v_new.message);
    return false;
  }

  // re-authenticate user
  const cred = EmailAuthProvider.credential(user.email, oldPassword);
  const newCred = await reauthenticateWithCredential(user, cred).catch(
    (error) => {
      setOldPasswordError(getErrorMessage(error));
    },
  );
  if (!newCred) return false;

  // update password
  const serverResponse = await updateAccount(user, {
    password: newPassword,
  }).catch((error) => {
    displayNotif(getErrorMessage(error), 'error');
  });

  if (!serverResponse) {
    return false;
  }
  if (!serverResponse.success) {
    setNewPasswordError(serverResponse.message);
    return false;
  }
  return true;
}

export async function handleSubmitPassword(
  e: React.FormEvent,
  user: User | null | undefined,
  setIsSubmitting: (s: boolean) => void,
  oldPassword: string,
  newPassword: string,
  setOldPassword: (p: string) => void,
  setNewPassword: (p: string) => void,
  setOldPasswordError: (e: string | undefined) => void,
  setNewPasswordError: (e: string | undefined) => void,
  setIsSectionExtended: (e: boolean) => void,
  setIsSubmittingForm: (s: 'init' | 'in progress' | 'done') => void,
) {
  e.preventDefault();
  setIsSubmitting(true);
  if (!user) return;
  setOldPasswordError(undefined);
  setNewPasswordError(undefined);
  const isUpdateSuccessful = await changePassword(
    user,
    oldPassword,
    newPassword,
    setOldPasswordError,
    setNewPasswordError,
  );

  if (isUpdateSuccessful) {
    setOldPassword('');
    setNewPassword('');
    setIsSectionExtended(false);
    setIsSubmittingForm('done');
  }
  setIsSubmitting(false);
}

/**
 * @returns updated account fields if successful,
 * or undefined if there was an error.
 */
export async function changeAccount(
  user: User | null | undefined,
  email: string,
  displayName: string,
  photoURL: string,
  setEmailError: (e: string | undefined) => void,
  setDisplayNameError: (e: string | undefined) => void,
): Promise<
  | {
      email?: string;
      emailVerified?: boolean;
      displayName?: string;
      photoURL?: string;
    }
  | undefined
> {
  // validate input
  if (!user) return;
  const v_email = validateEmail(email);
  if (!v_email.isValid) {
    setEmailError(v_email.message);
    return;
  }
  if (displayName === '') {
    setDisplayNameError('The display name cannot be empty.');
    return;
  }

  // update account data
  logEvent(getAnalytics(), ANALYTICS_EVENTS.PROFILE);
  const serverResponse = await updateAccount(user, {
    email: email,
    displayName: displayName,
    photoURL: photoURL,
  }).catch((error) => {
    displayNotif(getErrorMessage(error), 'error');
  });

  if (!serverResponse || !serverResponse.success) {
    if (serverResponse) displayNotif(serverResponse.message, 'error');
    return;
  }
  return serverResponse.data;
}

export async function handleSaveChanges(
  e: React.FormEvent,
  user: User | null | undefined,
  setSubmittingStage: (s: 'init' | 'in progress' | 'done') => void,
  email: string,
  displayName: string,
  photoURL: string,
  setEmailError: (e: string | undefined) => void,
  setDisplayNameError: (e: string | undefined) => void,
) {
  e.preventDefault();
  if (!user) return;
  setSubmittingStage('in progress');
  setEmailError(undefined);
  setDisplayNameError(undefined);
  const serverResponse = await changeAccount(
    user,
    email,
    displayName,
    photoURL,
    setEmailError,
    setDisplayNameError,
  );

  if (serverResponse) {
    // if user avatar changed, update cached url
    if (serverResponse.photoURL) {
      updateCachedData(
        LS.USER_PHOTO_URLS,
        user.uid,
        serverResponse.photoURL,
        'uid',
        'url',
      );
    }

    setSubmittingStage('done');
  } else {
    setSubmittingStage('init');
  }
}
