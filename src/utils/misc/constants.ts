// CSS
export const HEADER_SVG_PATH =
    'M 0,108 C 192,101.8 576,65.4 960,77 C 1344,88.6 1728,148.2 1920,166L1920 200L0 200z';
export const HEADER_SVG_VIEWBOX = `0 0 ${window.innerWidth} 200`;
export const DEFAULT_PROFILE_URL = 'https://i.imgur.com/gThi9Rl.png';

// LIMITS & DATA VALIDATION
export const POSTS_PER_PAGE = 3;
export const SCROLL_TOP_MAX_VAL = 2000;
export const MAX_FILE_SIZE = 5; // megabytes
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

// DATABASE
export const CLIENT_URL = 'http://localhost:3000';
export const SERVER_URL = 'http://localhost:5000';
export const DB_COLLECTIONS = {
    CHAT_ROOMS: 'chatRooms',
    COMMENTS: 'comments',
    METADATA: 'metadata',
    POSTS: 'posts',
    SUBREDDITS: 'subreddits',
    USERS: 'users',
};

// ALGOLIA
export const ALG_APP_ID = '1JHTFIMCJH';
export const ALG_API_KEY = '141efc34b4f66d65cf143e83c91ceae7';
export const ALG_INDICES = {
    POSTS: 'posts',
    USERS: 'users',
};

// LOCAL STORAGE ITEMS
export const LS_USER_PHOTO_URLS = 'cachedUserPhotoURLArray';
