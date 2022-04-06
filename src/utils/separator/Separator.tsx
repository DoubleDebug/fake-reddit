import css from './Separator.module.css';

interface ISeparatorProps {
    text: string;
}

export const Separator: React.FC<ISeparatorProps> = (props) => {
    return (
        <div className={css.separator}>
            <p>{props.text}</p>
        </div>
    );
};
