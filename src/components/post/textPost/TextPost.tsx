import { Link } from '@tanstack/react-router';
import { Markup } from 'interweave';

interface ITextPostProps {
  content: string;
  linkTo?: string;
}

export const TextPost: React.FC<ITextPostProps> = (props) => {
  if (props.linkTo)
    return (
      <Link to={props.linkTo} className="linkNoUnderline">
        <Markup content={props.content} />
      </Link>
    );

  return <Markup content={props.content} />;
};
