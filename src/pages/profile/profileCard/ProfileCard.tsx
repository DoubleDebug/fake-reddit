import css from './ProfileCard.module.css';
import Skeleton from 'react-loading-skeleton';
import { faCircle, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { getUserPhotoURL } from '../../../utils/firebase/getUserPhotoURL';
import { timeAgo } from '../../../utils/misc/timeAgo';
import { Link, Redirect, useRouteMatch } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import { openChatRoom } from '../profile/ProfileActions';
import { formatCakeDay } from '../../../utils/misc/formatTimestamp';
import { UserDataContext } from '../../../context/UserDataContext';
import { validateSubredditCreationEligibility } from '../../../utils/dataValidation/validateSubredditCreationEligibility';

interface IProfileCardProps {
    data: IUserDataWithId | undefined;
    isProfileMine: boolean;
    setShowReportModal: (s: boolean) => void;
}

export const ProfileCard: React.FC<IProfileCardProps> = (props) => {
    const user = useContext(UserContext);
    const userData = useContext(UserDataContext);
    const { url } = useRouteMatch();
    const [photoURL, setPhotoURL] = useState<string | undefined>();
    const [redirect, setRedirect] = useState<string | undefined>();
    const [loadingRoom, setLoadingRoom] = useState(false);
    const [newSubredditErrorMessage, setNewSubredditErrorMessage] = useState<
        string | undefined
    >();

    useEffect(() => {
        if (!userData) return;
        const isEligible = validateSubredditCreationEligibility(userData);
        if (!isEligible.success) {
            setNewSubredditErrorMessage(isEligible.message);
        }
    }, [userData]);

    useEffect(() => {
        if (!props.data) return;
        getUserPhotoURL(props.data.id).then((url) => setPhotoURL(url));
    }, [props.data]);

    if (redirect) {
        return <Redirect to={redirect} />;
    }

    return (
        <div className={css.container}>
            {photoURL ? (
                <img src={photoURL} alt="U" className={css.image} />
            ) : (
                <Skeleton circle className={css.image} />
            )}
            <h2 className={css.username}>
                {props.data ? (
                    props.data.username
                ) : (
                    <Skeleton width={150} className={css.username} />
                )}
            </h2>
            {props.data ? (
                <div className={css.status}>
                    <FontAwesomeIcon icon={faCircle} color="limegreen" />
                    <p className={css.lblOnline}>
                        {props.isProfileMine
                            ? 'online'
                            : timeAgo(props.data?.lastOnline.toDate())}
                    </p>
                </div>
            ) : (
                <Skeleton width={100} />
            )}
            <div className={css.userStats}>
                <div className="grid">
                    {props.data ? (
                        <>
                            <strong>Karma</strong>
                            <small>{props.data.karma}</small>
                        </>
                    ) : (
                        <Skeleton width={60} height={40} />
                    )}
                </div>
                <div className={css.separator}></div>
                <div className="grid">
                    {props.data ? (
                        <>
                            <strong>Cake day</strong>
                            <small>{formatCakeDay(props.data.cakeDay)}</small>
                        </>
                    ) : (
                        <Skeleton width={60} height={40} />
                    )}
                </div>
            </div>
            {props.data?.bio ? (
                <small className={css.bio}>{props.data.bio}</small>
            ) : null}
            {props.data ? (
                props.isProfileMine && (
                    <div className={css.buttons}>
                        <Link to="/newPost">
                            <button type="submit">New post</button>
                        </Link>
                        {newSubredditErrorMessage ? (
                            <button
                                disabled={true}
                                title={newSubredditErrorMessage}
                            >
                                New subreddit
                            </button>
                        ) : (
                            <Link to="/newSubreddit">
                                <button>New subreddit</button>
                            </Link>
                        )}
                        <Link to={`${url}/edit`}>
                            <button>Edit profile</button>
                        </Link>
                    </div>
                )
            ) : (
                <Skeleton count={2} className={css.skeletonButton} />
            )}
            {props.data && !props.isProfileMine && user && (
                <div className={css.buttons}>
                    <button
                        disabled={loadingRoom}
                        type="submit"
                        onClick={() => {
                            setLoadingRoom(true);
                            openChatRoom(user, props.data, setRedirect).then(
                                () => setLoadingRoom(false)
                            );
                        }}
                    >
                        {loadingRoom ? (
                            <FontAwesomeIcon icon={faCircleNotch} spin />
                        ) : (
                            'Send message'
                        )}
                    </button>
                    <button onClick={() => props.setShowReportModal(true)}>
                        Report user
                    </button>
                </div>
            )}
        </div>
    );
};
