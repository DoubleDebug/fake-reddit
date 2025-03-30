import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { validateEmail } from '../../../utils/dataValidation/validateRegisterForm';
import { getErrorMessage } from '../../../utils/misc/getErrorMessage';
import { displayNotif } from '../../../utils/misc/toast';

export function resetPassword(
  email: string,
  setIsLoading: (l: boolean) => void,
  setEmailError: (e: string) => void,
  setIsSubmitted: (s: boolean) => void,
) {
  const validation = validateEmail(email);
  if (!validation.isValid) {
    setEmailError(validation.message);
    setIsLoading(false);
    return;
  }

  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setTimeout(() => {
        displayNotif(`We've sent you an email.`, 'success');
      }, 500);
    })
    .catch((err) => {
      setIsLoading(false);
      displayNotif(getErrorMessage(err), 'error');
    });
}
