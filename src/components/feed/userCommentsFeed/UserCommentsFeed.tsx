interface IUserCommentsFeedProps {
    uid: string | undefined;
}

export const UserCommentsFeed: React.FC<IUserCommentsFeedProps> = (props) => {
    return <div className="flex">{props.uid}</div>;
};
