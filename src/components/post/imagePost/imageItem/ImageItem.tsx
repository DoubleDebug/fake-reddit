import css from '../ImagePost.module.css';
import { Link } from '@tanstack/react-router';
import { onImageLoad } from './ImageItemActions';

interface IImageItemProps {
  elementIndex: number;
  url: string;
  isLoading: boolean;
  setIsLoading: (l: boolean) => void;
  setIndex: (i: number) => void;
  linkTo?: string;
}

const ImageItemElement: React.FC<IImageItemProps> = (props) => (
  <img
    className={`${css.image} ${props.linkTo ? css.preview : ''}`}
    src={props.url}
    alt={`carousel-${props.elementIndex}`}
    onLoad={() => onImageLoad(props.setIsLoading, props.setIndex)}
  />
);

export const ImageItem: React.FC<IImageItemProps> = (props) => {
  return (
    <div className={`flex ${props.isLoading ? css.hidden : ''}`}>
      {props.linkTo ? (
        <Link className={`flex ${css.image}`} to={props.linkTo}>
          <ImageItemElement {...props} />
        </Link>
      ) : (
        <ImageItemElement {...props} />
      )}
    </div>
  );
};
