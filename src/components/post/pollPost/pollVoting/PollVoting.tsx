import css from './PollVoting.module.css';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useState } from 'react';
import { PollModel } from '../../../../models/poll';
import { displayNotif } from '../../../../utils/misc/toast';
import { submitVote } from './PollVotingActions';

interface IPollVotingProps {
  data: PollModel;
  isPreview: boolean;
  postId: string | undefined;
  uid: string | null | undefined;
  setChosenOption: (o: string) => void;
}

export const PollVoting: React.FC<IPollVotingProps> = (props) => {
  const [chosenOption, setChosenOption] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  return (
    <div className="flex">
      <RadioGroup
        className={css.pollContainer}
        onChange={(e) => setChosenOption(e.target.value)}
      >
        <FormLabel>{`${props.data.votes.length} votes`}</FormLabel>
        {props.data.options.map((option, index) => (
          <FormControlLabel
            key={`option${index}`}
            value={option}
            control={<Radio />}
            label={option}
          />
        ))}
      </RadioGroup>
      {!props.isPreview && props.uid && (
        <button
          className={css.btnVote}
          type="submit"
          disabled={isUploading}
          onClick={() => {
            if (!props.uid) return;
            if (!chosenOption) return;
            if (!props.postId) {
              displayNotif('Failed to submit your vote.', 'error');
              return;
            }
            if (props.data.votes.map((v) => v.uid).includes(props.uid)) return;

            setIsUploading(true);
            submitVote(
              props.uid,
              props.postId,
              props.data,
              chosenOption,
              props.data.votes,
              () => {
                setIsUploading(false);
                props.setChosenOption(chosenOption);
              },
            );
          }}
        >
          {isUploading ? (
            <FontAwesomeIcon
              icon={faCircleNotch}
              spin
              style={{
                margin: '0 0.5rem',
              }}
            ></FontAwesomeIcon>
          ) : (
            'Vote'
          )}
        </button>
      )}
    </div>
  );
};
