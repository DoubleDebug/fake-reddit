// REDUX
interface IAction {
    type: string;
    payload: any;
}

type AppState = {
    user: User | null | undefined;
};

type AuthAction = {
    type: string;
    user: User | null | undefined;
};

type DispatchType = (args: AuthAction) => AuthAction;

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
