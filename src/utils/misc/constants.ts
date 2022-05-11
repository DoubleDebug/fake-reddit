// PRODUCTION MODE
export const PRODUCTION_MODE = false;

// DATABASE
export const SERVER_URL = 'http://localhost:5000';
export const DB_HOSTNAME = 'localhost';
export const DB_PORT = 8080;
export const DB_COLLECTIONS = {
    CHAT_ROOMS: 'chatRooms',
    COMMENTS: 'comments',
    METADATA: 'metadata',
    POSTS: 'posts',
    REPORTS: 'reports',
    SUBREDDITS: 'subreddits',
    USERS: 'users',
};
export const STORAGE_FOLDERS = {
    CONTENT: 'content',
    SUBREDDIT_LOGOS: 'subredditLogos',
    USER_AVATARS: 'userAvatars',
};
export const SERVER_ENDPOINTS = {
    GET_USER_PHOTO_URL: `${SERVER_URL}/user/avatar`,
    GET_POSTS: `${SERVER_URL}/posts`,
    GET_POSTS_CUSTOM: `${SERVER_URL}/posts/custom`,
    GET_SAVED_POSTS: `${SERVER_URL}/user/saved-posts`,
    GET_USER_POSTS: `${SERVER_URL}/user/posts`,
    GET_USER_COMMENTS: `${SERVER_URL}/user/comments`,
    GET_USER_EMAIL_BY_USERNAME: `${SERVER_URL}/user/email`,
    POST_SUBMIT_POST: `${SERVER_URL}/posts`,
    POST_SUBMIT_SUBREDDIT: `${SERVER_URL}/subreddits`,
    POST_REGISTER_USER_PROVIDER: `${SERVER_URL}/register/with-provider`,
    POST_REGISTER_USER_EMAIL: `${SERVER_URL}/register/with-email`,
    PATCH_UPDATE_ACCOUNT: `${SERVER_URL}/user/account`,
    DELETE_POST: `${SERVER_URL}/posts`,
    DELETE_COMMENT: `${SERVER_URL}/comments`,
    DELETE_FILE: `${SERVER_URL}/files`,
    DELETE_ACCOUNT: `${SERVER_URL}/user/account`,
    DELETE_BAN_USER: `${SERVER_URL}/user/ban`,
};

// ANALYTICS
export const ANALYTICS_EVENTS = {
    SIGN_UP: 'sign_up',
    LOGIN: 'login',
    UPVOTE: 'upvote',
    DOWNVOTE: 'downvote',
    COMMENT: 'create_comment',
    MESSAGE: 'send_message',
    POST: 'create_new_post',
    DELETE_POST: 'delete_post',
    CREATE_SUBREDDIT: 'create_new_subreddit',
    FOLLOW_SUBREDDIT: 'follow_subreddit',
    SEARCH: 'click_search_hit',
    PROFILE: 'update_profile',
    SAVE_POST: 'save_post',
    LOAD_MORE: 'click_load_more',
    DELETE_ACCOUNT: 'delete_account',
};

// ALGOLIA
export const ALG_APP_ID = '1JHTFIMCJH';
export const ALG_API_KEY = '141efc34b4f66d65cf143e83c91ceae7';
export const ALG_INDICES = {
    POSTS: 'posts',
    USERS: 'users',
    SUBREDDITS: 'subreddits',
};

// LOCAL STORAGE ITEMS
export const LS = {
    USER_PHOTO_URLS: 'userPhotoURLs',
    SUBREDDIT_LOGO_URLS: 'subredditLogoURLs',
    LAST_UPDATED: 'lastUpdated',
    CONTENT_URLS: 'contentURLs',
};

// CSS
export const HEADER_SVG_PATH =
    'M 0,108 C 192,101.8 576,65.4 960,77 C 1344,88.6 1728,148.2 1920,166L1920 200L0 200z';
export const HEADER_SVG_VIEWBOX = `0 0 ${window.innerWidth} 200`;
export const DEFAULT_PROFILE_URL = 'https://i.imgur.com/gThi9Rl.png';
export const DEFAULT_SUBREDDIT_LOGO_URL = 'https://i.imgur.com/A6JOUiZ.png';

// LIMITS & DATA VALIDATION
export const POSTS_PER_PAGE = 3;
export const COMMENTS_PER_PAGE = 10;
export const SCROLL_TOP_MAX_VAL = 1000;
export const MAX_FILE_SIZE = 5; // megabytes
export const MAX_NUMBER_OF_FILES = 5;
export const MIN_POSITIVE_KARMA = 10;
export const MIN_ACCOUNT_AGE = 10; // days
export const SUBREDDIT_LIMITS = {
    MIN_NAME_LENGTH: 3,
    MAX_NAME_LENGTH: 20,
    MAX_DESCRIPTION_LENGTH: 100,
    MAX_NUM_OF_FLAIRS: 10,
    MIN_FLAIR_LENGTH: 2,
    MAX_FLAIR_LENGTH: 15,
};
export const MAX_BIO_LENGTH = 300;
export const IMAGE_FILE_FORMATS = ['jpg', 'jpeg', 'png', 'gif'];
export const VIDEO_FILE_FORMATS = ['mp4'];
export const SUPPORTED_FILE_FORMATS = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
];
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png'];
export const SUPPORTED_IMAGE_FORMATS_STRING = SUPPORTED_IMAGE_FORMATS.join(', ')
    .replaceAll('image/', '')
    .replaceAll('video/', '');
export const SUPPORTED_FILE_FORMATS_STRING = SUPPORTED_FILE_FORMATS.join(', ')
    .replaceAll('image/', '')
    .replaceAll('video/', '');
export const COMMON_FLAIRS = ['oc', 'spoiler', 'nsfw'];
export const TYPES_OF_VIOLATION = [
    'Harassment',
    'Threating violence',
    'Hate',
    'Sharing personal information',
    'Copyright violation',
    'Self-harm',
    'Spam',
    'Misinformation',
];
export const CUSTOM_ERROR_MESSAGES = [
    {
        code: 'auth/account-exists-with-different-credential',
        message: 'Account with this email address already exists.',
    },
    {
        code: 'auth/wrong-password',
        message: 'Incorrect password.',
    },
    {
        code: 'auth/user-not-found',
        message: 'User with specified email address was not found.',
    },
    {
        code: 'auth/invalid-password',
        message: 'The password is invalid.',
    },
    {
        code: 'auth/invalid-email',
        message: 'The email address is invalid.',
    },
    {
        code: 'auth/internal-error',
        message: 'There was an internal error. Please try again later.',
    },
    {
        code: 'auth/insufficient-permission',
        message: `You don't have permission to perform this action.`,
    },
    {
        code: 'auth/internal-error',
        message: 'There was an internal error. Please try again later.',
    },
    {
        code: 'auth/id-token-revoked',
        message:
            'Your Firebase ID token has been revoked. Please refresh your page.',
    },
    {
        code: 'auth/id-token-expired',
        message:
            'Your Firebase ID token has expired. Please refresh your page.',
    },
    {
        code: 'auth/email-already-exists',
        message: 'The provided email address is already taken.',
    },
    {
        code: 'auth/popup-closed-by-user',
        message: 'You closed the popup window.',
    },
    {
        code: 'auth/user-disabled',
        message: 'This user account has been blocked.',
    },
    {
        code: 'auth/requires-recent-login',
        message: 'Incorrect old password.',
    },
];
