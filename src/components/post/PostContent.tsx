import css from './Post.module.css';
import Skeleton from 'react-loading-skeleton';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { PostModel } from '../../models/post';
import { TextPost } from './textPost/TextPost';
import { ImagePost } from './imagePost/ImagePost';
import { PollPost } from './pollPost/PollPost';

interface IPostContentProps {
  data: PostModel;
  isPreview?: boolean;
}

export const PostContent: React.FC<IPostContentProps> = (props) => {
  const user = useContext(UserContext);

  if (!props.data.id) return <Skeleton count={10} />;

  return (
    <div
      className={`${css.postContent} ${
        props.isPreview && props.data.type !== 'image' ? css.preview : ''
      }`}
    >
      {props.data.type === 'text' && (
        <TextPost
          content={props.data.content || ''}
          linkTo={props.isPreview ? `/post/${props.data.id}` : undefined}
        />
      )}
      {props.data.type === 'image' && (
        <ImagePost
          contentFiles={props.data.contentFiles || []}
          linkTo={props.isPreview ? `/post/${props.data.id}` : undefined}
        />
      )}
      {props.data.type === 'poll' && (
        <PollPost
          user={user}
          data={props.data}
          linkTo={props.isPreview ? `/post/${props.data.id}` : undefined}
        />
      )}
      {props.isPreview && props.data.type === 'text' ? (
        <div className={css.fade}></div>
      ) : null}
    </div>
  );
};
