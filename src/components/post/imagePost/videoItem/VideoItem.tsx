import css from '../ImagePost.module.css';
import { onImageLoad } from '../imageItem/ImageItemActions';

interface IVideoItemProps {
    url: string;
    isLoading: boolean;
    setIsLoading: (l: boolean) => void;
    setIndex: (i: number) => void;
    linkTo?: string;
}

const VideoItemElement: React.FC<IVideoItemProps> = (props) => (
    <video
        controls
        className={`${css.video} ${props.linkTo ? css.preview : ''}`}
        src={props.url}
        onLoadedData={() => onImageLoad(props.setIsLoading, props.setIndex)}
    />
);

export const VideoItem: React.FC<IVideoItemProps> = (props) => {
    return (
        <div className={`flex ${props.isLoading ? css.hidden : ''}`}>
            <VideoItemElement {...props} />
        </div>
    );
};
