// GENERAL
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
