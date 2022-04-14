import css from '../LoginForm.module.css';
import { TextField } from '@mui/material';
import { useState } from 'react';
import { Separator } from '../../../utils/separator/Separator';
import { useFormState } from '../../../utils/hooks/useFormState';
import { Link } from 'react-router-dom';
import {
    loginWithGithub,
    loginWithGoogle,
    loginWithUsername,
} from './LoginActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

interface ILoginProps {
    setTabIndexCallback: (t: 'log in' | 'sign up') => void;
}

export const Login: React.FC<ILoginProps> = (props) => {
    const { username, setUsername, password, setPassword } = useFormState();
    const {
        username: usernameError,
        setUsername: setUsernameErrorMessage,
        password: passwordError,
        setPassword: setPasswordErrorMessage,
    } = useFormState();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="grid">
            <small className={css.label}>
                Log in using Google, Github or your username and password.
            </small>
            <div className={css.grid}>
                <button
                    disabled={isLoading}
                    className={css.btnProvider}
                    onClick={() => loginWithGoogle()}
                >
                    <div className={css.iconContainer}>
                        <img className={css.iconGoogle} alt="Google" />
                    </div>
                    Log in with Google
                </button>
                <button
                    disabled={isLoading}
                    className={css.btnProvider}
                    onClick={() => loginWithGithub()}
                >
                    <div className={css.iconContainer}>
                        <img className={css.iconGithub} alt="Github" />
                    </div>
                    Log in with GitHub
                </button>
                <Separator text="or" />
                <form className={css.form}>
                    <TextField
                        disabled={isLoading}
                        error={usernameError !== ''}
                        helperText={
                            usernameError === '' ? undefined : usernameError
                        }
                        className={css.inputField}
                        variant="outlined"
                        label="Username"
                        color="warning"
                        type="text"
                        onChange={(e) => setUsername(e.currentTarget.value)}
                        autoComplete="off"
                    />
                    <TextField
                        disabled={isLoading}
                        error={passwordError !== ''}
                        helperText={
                            passwordError === '' ? undefined : passwordError
                        }
                        className={css.inputField}
                        variant="outlined"
                        label="Password"
                        color="warning"
                        type="password"
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        autoComplete="off"
                    />
                    <button
                        disabled={isLoading}
                        type="submit"
                        className={css.btnLogin}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLoading(true);
                            setUsernameErrorMessage('');
                            setPasswordErrorMessage('');
                            loginWithUsername(
                                username,
                                password,
                                setUsernameErrorMessage,
                                setPasswordErrorMessage,
                                setIsLoading
                            );
                        }}
                    >
                        {isLoading ? (
                            <FontAwesomeIcon
                                icon={faCircleNotch}
                                spin
                                style={{ margin: '0 1rem' }}
                            />
                        ) : (
                            'Log in'
                        )}
                    </button>
                    <Link to="/login/resetPassword" className={css.link}>
                        <small className={css.linkForgot}>
                            Forgot your password?
                        </small>
                    </Link>
                    <small className="flex">
                        New to Reddit?
                        <small
                            onClick={() => props.setTabIndexCallback('sign up')}
                            className={css.linkSignUp}
                        >
                            Sign up.
                        </small>
                    </small>
                </form>
            </div>
        </div>
    );
};
