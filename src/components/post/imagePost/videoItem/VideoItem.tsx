import css from '../ImagePost.module.css';
import 'video-react/dist/video-react.css';
import { useEffect, useState } from 'react';
import { Player, BigPlayButton } from 'video-react';
import { onImageLoad } from '../imageItem/ImageItemActions';

interface IVideoItemProps {
  url: string;
  isLoading: boolean;
  setIsLoading: (l: boolean) => void;
  setIndex: (i: number) => void;
  linkTo?: string;
}

const VideoItemElement: React.FC<IVideoItemProps> = (props) => {
  const [player, setPlayer] = useState<any>();

  useEffect(() => {
    if (!player) return;
    onImageLoad(props.setIsLoading, props.setIndex);
    // eslint-disable-next-line
  }, [player]);

  return (
    <Player
      aspectRatio="4:3"
      ref={(player: any) => setPlayer(player)}
      src={props.url}
    >
      <BigPlayButton position="center" />
    </Player>
  );
};

export const VideoItem: React.FC<IVideoItemProps> = (props) => {
  return (
    <div className={`flex ${props.isLoading ? css.hidden : ''}`}>
      <VideoItemElement {...props} />
    </div>
  );
};
