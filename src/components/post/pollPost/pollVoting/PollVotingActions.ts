import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { PollModel, PollVote } from '../../../../models/poll';
import { DB_COLLECTIONS } from '../../../../utils/misc/constants';

export function submitVote(
  uid: string,
  postId: string,
  pollData: PollModel,
  chosenOption: string,
  votes: PollVote[],
  callback: Function,
) {
  const db = getFirestore();
  const docRef = doc(db, DB_COLLECTIONS.POSTS, postId);
  updateDoc(docRef, {
    pollData: {
      ...pollData,
      votes: [...votes, { uid: uid, option: chosenOption }],
    },
  }).then(() => {
    callback();
  });
}
