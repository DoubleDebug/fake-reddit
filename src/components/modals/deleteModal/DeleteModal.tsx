import css from './DeleteModal.module.css';
import { Modal } from '../../../utils/modal/Modal';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { displayNotif } from '../../../utils/misc/toast';
import { toUppercaseFirstLetter } from '../../../utils/misc/toUppercaseFirstLetter';

interface IDeleteModalProps {
    itemBeingDeleted: string;
    action: () => Promise<void>;
    showStateHandler: (s: boolean) => void;
}

export const DeleteModal: React.FC<IDeleteModalProps> = (props) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Modal showStateHandler={props.showStateHandler} title="Confirmation">
            <div className="grid">
                <p>
                    Are you sure you want to delete this{' '}
                    {props.itemBeingDeleted}?
                    <br />
                    This action cannot be undone.
                </p>
                <div className="flex">
                    <button
                        className={`btn ${css.btnCancel}`}
                        onClick={() => props.showStateHandler(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn"
                        style={{ marginBottom: '0px' }}
                        disabled={isLoading}
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLoading(true);
                            props.action().then(() => {
                                setIsLoading(false);
                                props.showStateHandler(false);
                                setTimeout(() => {
                                    displayNotif(
                                        `${toUppercaseFirstLetter(
                                            props.itemBeingDeleted
                                        )} successfully deleted.`,
                                        'success'
                                    );
                                }, 500);
                            });
                        }}
                    >
                        {isLoading ? (
                            <FontAwesomeIcon
                                icon={faCircleNotch}
                                spin
                                style={{ margin: '0 1rem' }}
                            />
                        ) : (
                            'Delete'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
