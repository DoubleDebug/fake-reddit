import css from '../EditAccount.module.css';
import { TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { handleSubmitPassword } from '../../EditProfileActions';
import { UserContext } from '../../../../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface IEditPasswordState {
    oldPassword?: string;
    newPassword?: string;
}

interface IEditPasswordProps {
    isLoading: boolean;
    userProvider: 'google' | 'github' | 'password';
    state: IEditPasswordState;
    handleNewState: (s: IEditPasswordState) => void;
    setSubmittingStage: (s: 'init' | 'in progress' | 'done') => void;
}

export const EditPassword: React.FC<IEditPasswordProps> = (props) => {
    const user = useContext(UserContext);
    const [oldPassword, setOldPassword] = useState(
        props.state.oldPassword || ''
    );
    const [newPassword, setNewPassword] = useState(
        props.state.newPassword || ''
    );
    const [oldPasswordError, setOldPasswordError] = useState<
        string | undefined
    >();
    const [newPasswordError, setNewPasswordError] = useState<
        string | undefined
    >();
    const [isSectionExtended, setIsSectionExtended] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        props.handleNewState({
            oldPassword: oldPassword,
            newPassword: newPassword,
        });
        // eslint-disable-next-line
    }, [oldPassword, newPassword]);

    if (props.userProvider === 'google') {
        return (
            <div className={css.provider}>
                <p>Signed in with</p>
                <img
                    title="Google"
                    alt="Google"
                    className={`${css.iconProvider} ${css.iconGoogle}`}
                />
                <div></div>
            </div>
        );
    }
    if (props.userProvider === 'github') {
        return (
            <div className={css.provider}>
                <small>Signed in with</small>
                <img
                    title="Github"
                    alt="Github"
                    className={`${css.iconProvider} ${css.iconGithub}`}
                />
            </div>
        );
    }

    return (
        <div className="grid">
            <div className="flex">
                <div className="grid">
                    <div className={css.pswdInfo}>
                        <strong>Change password</strong>
                        <FontAwesomeIcon
                            icon={faInfoCircle}
                            color="lightblue"
                            title="Password requirements:&#013;
                            - Length: 5 to 20 characters.&#013;
                            - Allowed characters: a-z, A-Z, 0-9, dot, underscore and blank space.&#013;
                            - You will be logged out after changing your password."
                        />
                    </div>
                    <small>
                        Your password must be at least 5 letters long.
                    </small>
                </div>
                {!isSectionExtended && (
                    <button
                        disabled={props.isLoading}
                        onClick={() => {
                            setIsSectionExtended(true);
                        }}
                        style={{ marginLeft: 'auto' }}
                    >
                        Change
                    </button>
                )}
            </div>
            <form
                className={`${css.pswdSection} ${
                    isSectionExtended ? css.extended : ''
                }`}
            >
                <TextField
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={props.isLoading || isSubmitting}
                    error={oldPasswordError !== undefined}
                    helperText={oldPasswordError}
                    label="Old password"
                    type="password"
                    fullWidth
                />
                <TextField
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={props.isLoading || isSubmitting}
                    error={newPasswordError !== undefined}
                    helperText={newPasswordError}
                    label="New password"
                    type="password"
                    fullWidth
                />
                <div className={css.pswdButtons}>
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        onClick={(e) =>
                            handleSubmitPassword(
                                e,
                                user,
                                setIsSubmitting,
                                oldPassword,
                                newPassword,
                                setOldPassword,
                                setNewPassword,
                                setOldPasswordError,
                                setNewPasswordError,
                                setIsSectionExtended,
                                props.setSubmittingStage
                            )
                        }
                    >
                        {isSubmitting ? (
                            <FontAwesomeIcon
                                icon={faCircleNotch}
                                spin
                                style={{ margin: '0 1.1rem' }}
                            />
                        ) : (
                            'Submit'
                        )}
                    </button>
                    <button
                        style={{ margin: '0 0.5rem 0 auto' }}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsSectionExtended(false);
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};
