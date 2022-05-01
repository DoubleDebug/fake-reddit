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
export const SERVER_ENDPOINTS = {
    GET_USER_PHOTO_URL: `${SERVER_URL}/getUserPhotoURL`,
    GET_POSTS: `${SERVER_URL}/getFeed`,
    GET_POSTS_CUSTOM: `${SERVER_URL}/getCustomFeed`,
    GET_SAVED_POSTS: `${SERVER_URL}/getSavedPosts`,
    GET_USER_POSTS: `${SERVER_URL}/getUserPosts`,
    GET_USER_COMMENTS: `${SERVER_URL}/getUserComments`,
    GET_USER_EMAIL_BY_USERNAME: `${SERVER_URL}/getUserEmailByUsername`,
    POST_SUBMIT_POST: `${SERVER_URL}/submitPost`,
    POST_REGISTER_USER_PROVIDER: `${SERVER_URL}/registerUserWithProvider`,
    POST_REGISTER_USER_EMAIL: `${SERVER_URL}/registerUserWithEmail`,
    DELETE_POST: `${SERVER_URL}/deletePost`,
    DELETE_COMMENT: `${SERVER_URL}/deleteComment`,
    DELETE_FILE: `${SERVER_URL}/deleteFile`,
    DELETE_USER: `${SERVER_URL}/deleteUser`,
};

// ALGOLIA
export const ALG_APP_ID = '1JHTFIMCJH';
export const ALG_API_KEY = '141efc34b4f66d65cf143e83c91ceae7';
export const ALG_INDICES = {
    POSTS: 'posts',
    USERS: 'users',
};

// LOCAL STORAGE ITEMS
export const LS = {
    USER_PHOTO_URLS: 'cachedUserPhotoURLs',
    LAST_UPDATED: 'lastUpdated',
    CONTENT_URLS: 'cachedContentURLs',
};

// CSS
export const HEADER_SVG_PATH =
    'M 0,108 C 192,101.8 576,65.4 960,77 C 1344,88.6 1728,148.2 1920,166L1920 200L0 200z';
export const HEADER_SVG_VIEWBOX = `0 0 ${window.innerWidth} 200`;
export const DEFAULT_PROFILE_URL = 'https://i.imgur.com/gThi9Rl.png';

// LIMITS & DATA VALIDATION
export const POSTS_PER_PAGE = 3;
export const COMMENTS_PER_PAGE = 10;
export const SCROLL_TOP_MAX_VAL = 1000;
export const MAX_FILE_SIZE = 5; // megabytes
export const MAX_NUMBER_OF_FILES = 5;
export const IMAGE_FILE_FORMATS = ['jpg', 'jpeg', 'png', 'gif'];
export const VIDEO_FILE_FORMATS = ['mp4'];
export const SUPPORTED_FILE_FORMATS = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
];
export const SUPPORTED_FILE_FORMATS_STRING = SUPPORTED_FILE_FORMATS.join(', ')
    .replaceAll('image/', '')
    .replaceAll('video/', '');
export const COMMON_FLAIRS = ['OC', 'Spoiler', 'NSFW'];
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
];
