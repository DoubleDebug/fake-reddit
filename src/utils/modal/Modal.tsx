import css from './Modal.module.css';
import { ReactNode } from 'react';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IModalProps {
  children?: ReactNode;
  showStateHandler: (s: boolean) => void;
  title: string;
}

export const Modal: React.FC<IModalProps> = (props) => {
  return (
    <div
      className={css.container}
      onClick={() => props.showStateHandler(false)}
    >
      <div
        className={`contentBox ${css.dialog}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex">
          <h1 className={css.title}>{props.title}</h1>
          <FontAwesomeIcon
            icon={faWindowClose}
            className={css.icon}
            onClick={() => props.showStateHandler(false)}
            color="silver"
          />
        </div>
        {props.children}
      </div>
    </div>
  );
};
