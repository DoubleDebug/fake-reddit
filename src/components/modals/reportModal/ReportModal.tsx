import css from './ReportModal.module.css';
import { Modal } from '../../../utils/modal/Modal';
import { TYPES_OF_VIOLATION } from '../../../utils/misc/constants';
import { useContext, useState } from 'react';
import { TextField } from '@mui/material';
import { UserContext } from '../../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import {
  handleOnClickViolation,
  handleOnSubmitReport,
} from './ReportModalActions';

interface IReportModalProps {
  type: 'user' | 'post';
  contentId: string;
  showStateHandler: (s: boolean) => void;
}

export const ReportModal: React.FC<IReportModalProps> = (props) => {
  const user = useContext(UserContext);
  const [violations, setViolations] = useState(
    TYPES_OF_VIOLATION.map((v) => ({ name: v, selected: false })),
  );
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Modal
      title={`Report ${props.type}`}
      showStateHandler={props.showStateHandler}
    >
      <div className={css.container}>
        <div className="grid">
          <p className={css.description}>
            Thank you for looking out for others by reporting things that break
            the rules.
            <br />
            Please select why you think this {props.type} violates the rules.
          </p>
          <div className={css.violationContainer}>
            {violations.map((v) => (
              <div
                key={`violation-${v.name}`}
                className={`${css.violation} ${v.selected ? css.selected : ''}`}
                onClick={() =>
                  handleOnClickViolation(violations, setViolations, v)
                }
              >
                {v.name}
              </div>
            ))}
          </div>
          <TextField
            multiline
            placeholder="Leave a note (optional)"
            inputProps={{ maxLength: 1000 }}
            color="warning"
            onChange={(e) => setNote(e.currentTarget.value)}
            className={css.note}
          />
          <button
            className={css.btnSubmit}
            type="submit"
            disabled={isSubmitting}
            onClick={(e) =>
              handleOnSubmitReport(
                e,
                violations,
                user,
                props.type,
                props.contentId,
                props.showStateHandler,
                note,
                setIsSubmitting,
              )
            }
          >
            {isSubmitting ? (
              <FontAwesomeIcon
                icon={faCircleNotch}
                spin
                style={{
                  margin: '0 1.2rem',
                }}
              />
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
