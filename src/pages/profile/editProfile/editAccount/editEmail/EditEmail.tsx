import css from '../EditAccount.module.css';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../../../../context/UserContext';
import { sendVerificationEmail } from '../../EditProfileActions';
import { getAdornments } from './Adornments';

interface IEditEmailState {
  email?: string;
  verificationStage?: 'init' | 'in progress' | 'sent';
}

interface IEditEmailProps {
  emailError: string | undefined;
  isLoading: boolean;
  state: IEditEmailState;
  handleNewState: (s: IEditEmailState) => void;
}

export const EditEmail: React.FC<IEditEmailProps> = (props) => {
  const user = useContext(UserContext);

  return (
    <>
      <TextField
        value={props.state.email}
        onChange={(e) => props.handleNewState({ email: e.target.value })}
        disabled={props.isLoading}
        error={props.emailError !== undefined}
        helperText={props.emailError}
        label="Email address"
        type="email"
        InputProps={getAdornments(props.isLoading, user)}
        autoComplete="off"
      />
      {!props.isLoading && !user?.emailVerified && (
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            sendVerificationEmail(user, (s) =>
              props.handleNewState({ verificationStage: s }),
            );
          }}
          className={css.btnVerify}
          disabled={props.state.verificationStage !== 'init'}
        >
          {props.state.verificationStage === 'in progress' ? (
            <FontAwesomeIcon
              icon={faCircleNotch}
              spin
              style={{
                margin: '0 2.1rem',
              }}
            />
          ) : (
            'Verify email'
          )}
        </button>
      )}
    </>
  );
};
