interface IChatter {
  id: string;
  name: string;
}

interface IChatRoom {
  id: string;
  userIds: string[];
  userNames: string[];
  createdAt: Timestamp;
  messages: IMessage[];
  unreadMessagesCount: number[];
}

interface IMessage {
  from: IChatter;
  content: string;
  timestamp: Timestamp;
}

interface IUserData {
  lastOnline: Timestamp;
  savedPosts: string[];
  username: string;
  karma: number;
  cakeDay: Timestamp;
  isAdmin?: boolean;
  bio?: string;
  hideNSFW?: boolean;
}

type IUserDataWithId = IUserData & { id: string };

interface IVote {
  uid: string;
  upvoted: boolean;
}

type PostType = 'text' | 'image' | 'poll';

type PostHit = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  subreddit: string;
};

type SubredditHit = {
  id: string;
  name: string;
  description: string;
};

type ResponseStatus = { success: false; message: string } | { success: true };

type ResponseStatusWithData =
  | { success: false; message: string }
  | { success: true; data: any };

type ValidationResult =
  | {
      isValid: false;
      message: string;
    }
  | {
      isValid: true;
    };

// untyped Javascript libraries
declare module 'video-react';
declare module 'react-quill';
