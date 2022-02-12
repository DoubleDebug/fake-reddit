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
}

interface IMessage {
    from: IChatter;
    content: string;
    timestamp: Timestamp;
}

interface IUserData {
    lastOnline: Timestamp;
}

interface IVote {
    uid: string;
    upvoted: boolean;
}

type PostType = 'text' | 'image' | 'poll';

type ResponseStatus = { success: false; message: string } | { success: true };
