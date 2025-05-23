import css from './ResetPassword.module.css';
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { resetPassword } from './ResetPasswordActions';
import { Link, Navigate } from '@tanstack/react-router';
import { Route } from '../../../routes/login.reset-password';

export const ResetPassword: React.FC = () => {
  const { email: queryEmail } = Route.useSearch();
  const [email, setEmail] = useState(queryEmail || '');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = `Reset your password | Moj Reddit`;
  }, []);

  if (isSubmitted) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={`contentBox ${css.container}`}>
      <form className={css.form}>
        <h2 className={css.title}>Reset your password</h2>
        <small className={css.description}>
          Enter your email address
          <br />
          and you will receive a link where you can reset your password.
        </small>
        <TextField
          disabled={isLoading}
          error={emailError !== ''}
          helperText={emailError === '' ? undefined : emailError}
          className={css.inputField}
          color="warning"
          variant="outlined"
          type="email"
          label="Email address"
          defaultValue={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          autoComplete="off"
        />
        <button
          disabled={isLoading}
          type="submit"
          className={css.btnSubmit}
          onClick={(e) => {
            e.preventDefault();
            setIsLoading(true);
            resetPassword(email, setIsLoading, setEmailError, setIsSubmitted);
          }}
        >
          {isLoading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : 'Submit'}
        </button>
        <Link className={css.link} to="/login">
          <small>Go back</small>
        </Link>
      </form>
    </div>
  );
};
