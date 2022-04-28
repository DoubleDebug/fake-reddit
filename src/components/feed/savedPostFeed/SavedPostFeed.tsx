interface ISavedPostFeedProps {
    postIds: string[] | undefined;
}

export const SavedPostFeed: React.FC<ISavedPostFeedProps> = (props) => {
    return <div className="flex">{JSON.stringify(props.postIds)}</div>;
};
