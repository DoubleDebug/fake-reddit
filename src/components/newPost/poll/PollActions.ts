import { PollModel } from '../../../models/poll';
import { displayNotif } from '../../../utils/misc/toast';

type RMouseEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

export function updateOption(
  index: number,
  newValue: string,
  pollData: PollModel,
  setPollData: (p: PollModel) => void,
) {
  const validationStatus = pollData.validateNewOption(newValue);
  if (!validationStatus.success) {
    displayNotif(validationStatus.message, 'error', true);
    return;
  }

  setPollData(pollData.update(index, newValue));
}

export function addOption(
  e: RMouseEvent,
  pollData: PollModel,
  setPollData: (p: PollModel) => void,
) {
  e.preventDefault();
  setPollData(pollData.add());
}

export function removeOption(
  e: RMouseEvent,
  index: number,
  pollData: PollModel,
  setPollData: (p: PollModel) => void,
) {
  e.preventDefault();
  setPollData(pollData.remove(index));
}
