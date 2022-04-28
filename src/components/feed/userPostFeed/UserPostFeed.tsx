interface IUserPostFeedProps {
    uid: string | undefined;
}

export const UserPostFeed: React.FC<IUserPostFeedProps> = (props) => {
    return <div className="grid">{props.uid}</div>;
};
