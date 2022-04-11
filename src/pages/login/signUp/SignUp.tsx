import css from '../LoginForm.module.css';
import { TextField } from '@mui/material';
import { Separator } from '../../../utils/separator/Separator';
import { useFormState } from '../../../utils/hooks/useFormState';
import { signUpWithEmail } from './SignUpActions';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { loginWithGithub, loginWithGoogle } from '../login/LoginActions';

interface ISignUpProps {
    setTabIndexCallback: (t: 'log in' | 'sign up') => void;
}

export const SignUp: React.FC<ISignUpProps> = (props) => {
    const { username, setUsername, password, setPassword, email, setEmail } =
        useFormState();
    const {
        username: usernameError,
        setUsername: setUsernameErrorMessage,
        password: passwordError,
        setPassword: setPasswordErrorMessage,
        email: emailError,
        setEmail: setEmailErrorMessage,
    } = useFormState();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="grid">
            <small className={css.label}>
                Sign up using Google, Github or your username and password.
            </small>
            <div className={css.grid}>
                <button
                    disabled={isLoading}
                    className={`btn ${css.btnProvider}`}
                    onClick={() => loginWithGoogle(true)}
                >
                    <div className={css.iconContainer}>
                        <img className={css.iconGoogle} alt="Google" />
                    </div>
                    Sign up with Google
                </button>
                <button
                    disabled={isLoading}
                    className={`btn ${css.btnProvider}`}
                    onClick={() => loginWithGithub(true)}
                >
                    <div className={css.iconContainer}>
                        <img className={css.iconGithub} alt="Github" />
                    </div>
                    Sign up with GitHub
                </button>
                <Separator text="or" />
                <form className={css.form}>
                    <TextField
                        disabled={isLoading}
                        className={css.inputField}
                        variant="outlined"
                        label="Email"
                        color="warning"
                        type="email"
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        autoComplete="off"
                        error={emailError !== ''}
                        helperText={emailError}
                    />
                    <TextField
                        disabled={isLoading}
                        className={css.inputField}
                        variant="outlined"
                        label="Username"
                        color="warning"
                        type="text"
                        onChange={(e) => setUsername(e.currentTarget.value)}
                        autoComplete="off"
                        error={usernameError !== ''}
                        helperText={usernameError}
                    />
                    <TextField
                        disabled={isLoading}
                        className={css.inputField}
                        variant="outlined"
                        label="Password"
                        color="warning"
                        type="password"
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        autoComplete="off"
                        error={passwordError !== ''}
                        helperText={passwordError}
                    />
                    <button
                        disabled={isLoading}
                        type="submit"
                        className={`btn ${css.btnLogin}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLoading(true);
                            setEmailErrorMessage('');
                            setUsernameErrorMessage('');
                            setPasswordErrorMessage('');
                            signUpWithEmail(
                                email,
                                username,
                                password,
                                setUsernameErrorMessage,
                                setPasswordErrorMessage,
                                setEmailErrorMessage,
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
                            'Sign up'
                        )}
                    </button>
                    <small>
                        Already a Redditor?{' '}
                        <small
                            onClick={() => props.setTabIndexCallback('log in')}
                            className={css.link}
                        >
                            Log in.
                        </small>
                    </small>
                </form>
            </div>
        </div>
    );
};
