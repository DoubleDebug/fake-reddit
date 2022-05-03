import css from './NewSubreddit.module.css';
import { ISubreddit } from '../../models/subreddit';
import { InputAdornment, TextField, ThemeProvider } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../../context/UserDataContext';
import { validateSubredditCreationEligibility } from '../../utils/dataValidation/validateSubredditCreationEligibility';
import {
    COMMON_FLAIRS,
    STORAGE_FOLDERS,
    SUBREDDIT_LIMITS,
} from '../../utils/misc/constants';
import { addFlair, submitSubreddit } from './NewSubredditActions';
import { myTheme } from '../../utils/muiThemes/myTheme';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ImageUploader } from '../../components/newPost/imageUploader/ImageUploader';
import { displayNotif } from '../../utils/misc/toast';
import { Redirect } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export const NewSubreddit: React.FC = () => {
    const user = useContext(UserContext);
    const userData = useContext(UserDataContext);
    const [subreddit, setSubreddit] = useState<ISubreddit>({
        id: '',
        description: '',
        followers: [],
        flairs: [],
        photoURL: '',
    });
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [flairError, setFlairError] = useState<string | undefined>();
    const [currentFlair, setCurrentFlair] = useState('');
    const [isAddBtnExtended, setIsAddBtnExtended] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        document.title = `Create a community | Fake Reddit`;
    }, []);

    useEffect(() => {
        if (!userData) return;
        const isEligible = validateSubredditCreationEligibility(userData);
        if (!isEligible.success) {
            setErrorMessage(isEligible.message);
        }
    }, [userData]);

    if (redirect || errorMessage) {
        errorMessage && displayNotif(errorMessage, 'error');
        return <Redirect to="/" />;
    }

    return (
        <div className={`contentBox ${css.container}`}>
            <ThemeProvider theme={myTheme}>
                <h1>Create a subreddit</h1>
                <TextField
                    label="Name"
                    size="small"
                    autoComplete="off"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">r/</InputAdornment>
                        ),
                    }}
                    inputProps={{
                        maxLength: SUBREDDIT_LIMITS.MAX_NAME_LENGTH,
                    }}
                    style={{ marginBottom: '1rem' }}
                    value={subreddit.id}
                    onChange={(e) =>
                        setSubreddit({
                            ...subreddit,
                            id: e.currentTarget.value,
                        })
                    }
                />
                <TextField
                    autoComplete="off"
                    label="Description"
                    multiline
                    className={css.description}
                    inputProps={{
                        maxLength: SUBREDDIT_LIMITS.MAX_DESCRIPTION_LENGTH,
                    }}
                    value={subreddit.description}
                    onChange={(e) =>
                        setSubreddit({
                            ...subreddit,
                            description: e.currentTarget.value,
                        })
                    }
                />
                <div className="grid">
                    <div className={css.group}>
                        <p className={css.groupLabel}>Flairs</p>
                        {[...COMMON_FLAIRS, ...(subreddit.flairs || [])].map(
                            (f, ind) => (
                                <button
                                    key={`flair-${ind}`}
                                    title={
                                        COMMON_FLAIRS.includes(f)
                                            ? 'Common flair'
                                            : 'Tap to remove'
                                    }
                                    className={css.btnFlair}
                                    onClick={() => {
                                        setSubreddit({
                                            ...subreddit,
                                            flairs: subreddit.flairs?.filter(
                                                (fl) => fl !== f
                                            ),
                                        });
                                    }}
                                >
                                    {f}
                                </button>
                            )
                        )}
                        {isAddBtnExtended ? (
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const added = addFlair(
                                        currentFlair,
                                        setFlairError,
                                        subreddit,
                                        setSubreddit
                                    );
                                    if (added) {
                                        // reset input field
                                        setIsAddBtnExtended(false);
                                        setFlairError(undefined);
                                        setCurrentFlair('');
                                    }
                                }}
                            >
                                <TextField
                                    size="small"
                                    autoComplete="off"
                                    placeholder="e.g. question"
                                    error={flairError !== undefined}
                                    helperText={flairError}
                                    value={currentFlair}
                                    className={css.btnAddTextbox}
                                    inputProps={{
                                        maxLength:
                                            SUBREDDIT_LIMITS.MAX_FLAIR_LENGTH,
                                    }}
                                    onChange={(e) =>
                                        setCurrentFlair(e.currentTarget.value)
                                    }
                                    autoFocus
                                    onBlur={() => setIsAddBtnExtended(false)}
                                    onKeyDown={(e) =>
                                        e.key === 'Escape' &&
                                        setIsAddBtnExtended(false)
                                    }
                                />
                            </form>
                        ) : (
                            subreddit.flairs!.length <
                                SUBREDDIT_LIMITS.MAX_NUM_OF_FLAIRS && (
                                <button
                                    className={css.btnAdd}
                                    onClick={() => setIsAddBtnExtended(true)}
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            )
                        )}
                    </div>
                </div>
                <div style={{ position: 'relative' }}>
                    <p className={css.groupLabel}>Community icon</p>
                </div>
                <ImageUploader
                    handleContentUpdate={(files) => {
                        setSubreddit({
                            ...subreddit,
                            photoURL: files[0].storagePath,
                        });
                    }}
                    handleNewState={() => {}}
                    noVideos
                    noMultipleFiles
                    differentStoragePath={STORAGE_FOLDERS.SUBREDDIT_LOGOS}
                />
                <button
                    disabled={isSubmitting}
                    type="submit"
                    className={css.btnSubmit}
                    onClick={(e) => {
                        e.preventDefault();
                        submitSubreddit(
                            user,
                            subreddit,
                            setIsSubmitting,
                            () => {
                                setRedirect(true);
                                displayNotif(
                                    'Successfully created a new subreddit!',
                                    'success'
                                );
                            }
                        );
                    }}
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
                {errorMessage && <p>{errorMessage}</p>}
            </ThemeProvider>
        </div>
    );
};
