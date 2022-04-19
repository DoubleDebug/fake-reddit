import { Markup } from 'interweave';
import { Link } from 'react-router-dom';

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
