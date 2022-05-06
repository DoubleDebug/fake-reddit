import { faInfoCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputAdornment } from '@mui/material';
import { User } from 'firebase/auth';

export function getAdornments(
    isLoading: boolean,
    user: User | null | undefined
) {
    const title = `You will be logged out after changing your email address.`;
    const startAdornment = {
        startAdornment: (
            <InputAdornment position="start">
                <FontAwesomeIcon
                    color="lightblue"
                    icon={faInfoCircle}
                    title={title}
                />
            </InputAdornment>
        ),
    };

    if (!isLoading && user && user.emailVerified)
        return {
            ...startAdornment,
            endAdornment: (
                <InputAdornment position="end">
                    <FontAwesomeIcon
                        color="green"
                        icon={faCheckCircle}
                        title="Verified"
                    />
                </InputAdornment>
            ),
        };

    return startAdornment;
}
