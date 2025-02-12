import {
  doc,
  Timestamp,
  updateDoc,
  increment,
  getFirestore,
  FieldValue,
  WithFieldValue,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from '@firebase/firestore';
import { User } from 'firebase/auth';
import { DB_COLLECTIONS } from '../utils/misc/constants';
import { deletePost } from '../utils/firebase/deletePost';
import { displayNotif } from '../utils/misc/toast';
import { PollModel } from './poll';
import { validatePostData } from '../utils/dataValidation/validatePostData';
import { cleanObject } from '../utils/misc/cleanObject';
import { submitPost } from '../utils/firebase/submitPost';

export class PostModel {
  id: string | undefined = undefined;
  title: string = '';
  type: PostType = 'text';
  content?: string = '';
  author: string = '';
  authorId: string | undefined | null;
  createdAt: Timestamp = Timestamp.now();
  votes: IVote[] = [];
  score: number = 0;
  subreddit: string = 'all';
  contentFiles?: string[] = [];
  pollData?: PollModel;
  flairs: string[] = [];
  isNSFW: boolean = false;

  constructor(init?: Partial<PostModel>) {
    Object.assign(this, init);
  }

  getScore(): number {
    return this.votes.reduce((score: number, curr: IVote) => {
      if (curr.upvoted) return score + 1;
      else return score - 1;
    }, 0);
  }

  getUsersVote(uid: string): boolean | null {
    const userVote = this.votes.filter((v) => v.uid === uid);
    if (userVote.length === 0) return null;
    return userVote[0].upvoted;
  }

  getUpvotedPercentage(): number {
    const numOfUpvoted = this.votes.filter((v) => v.upvoted).length;
    const numOfVotes = this.votes.length;

    if (numOfVotes === 0) return 0;

    return Math.round((numOfUpvoted / numOfVotes) * 100);
  }

  upvote(uid: string) {
    if (!this.id) return;
    const usersVote = this.getUsersVote(uid);
    let newKarmaValue;

    if (usersVote === null) {
      this.votes.push({
        uid: uid,
        upvoted: true,
      });
      newKarmaValue = increment(1);
    } else if (usersVote === true) {
      this.votes = this.votes.filter((v) => v.uid !== uid);
      newKarmaValue = increment(-1);
    } else {
      this.votes = this.votes.filter((v) => v.uid !== uid);
      this.votes.push({
        uid: uid,
        upvoted: true,
      });
      newKarmaValue = increment(2);
    }

    // update post upvotes
    const db = getFirestore();
    updateDoc(doc(db, DB_COLLECTIONS.POSTS, this.id), {
      votes: this.votes,
      score: this.getScore(),
    });

    // update user karma
    if (!this.authorId) return;
    updateDoc(doc(db, DB_COLLECTIONS.USERS, this.authorId), {
      karma: newKarmaValue,
    });
  }

  downvote(uid: string) {
    if (!this.id) return;
    const usersVote = this.getUsersVote(uid);
    let newKarmaValue;

    if (usersVote === null) {
      this.votes.push({
        uid: uid,
        upvoted: false,
      });
      newKarmaValue = increment(-1);
    } else if (usersVote === true) {
      this.votes = this.votes.filter((v) => v.uid !== uid);
      this.votes.push({
        uid: uid,
        upvoted: false,
      });
      newKarmaValue = increment(-2);
    } else {
      this.votes = this.votes.filter((v) => v.uid !== uid);
      newKarmaValue = increment(1);
    }

    // update post downvotes
    const db = getFirestore();
    updateDoc(doc(db, DB_COLLECTIONS.POSTS, this.id), {
      votes: this.votes,
      score: this.getScore(),
    });

    // update user karma
    if (!this.authorId) return;
    updateDoc(doc(db, DB_COLLECTIONS.USERS, this.authorId), {
      karma: newKarmaValue,
    });
  }

  async delete(user: User, subreddit: string, callback?: () => void) {
    if (!this.id) return;

    // delete post
    await deletePost(user, this.id)
      .then(() => {
        displayNotif('Post deleted.', 'success');
      })
      .catch((error) => {
        console.log(error);
        displayNotif('Failed to delete post.', 'error');
      });

    // execute callback method
    if (callback) callback();

    // update metadata counters
    const counters: Record<string, FieldValue> = {
      all: increment(-1),
    };
    if (subreddit !== 'all') counters[subreddit] = increment(-1);

    const db = getFirestore();
    updateDoc(doc(db, DB_COLLECTIONS.METADATA, 'numOfPosts'), counters);
  }

  async submit(
    user: User,
    userData: IUserData,
    subreddit: string,
    callbackOnInvalidData: () => void,
    callbackOnSuccess: () => void,
    callbackOnFail: () => void,
  ) {
    this.subreddit = subreddit;

    // data validation
    const validationResponse = validatePostData(this, user);
    if (!validationResponse.success) {
      callbackOnInvalidData();
      displayNotif(validationResponse.message, 'error');
      return;
    }

    // prepare data
    let postObject: any = {
      ...this,
      author: userData.username,
      subreddit: subreddit,
      isNSFW: this.flairs.includes('nsfw'),
    };
    postObject = cleanObject(postObject); // remove all empty fields from post data

    // send data to firestore
    const sererResponse = await submitPost(user, postObject);

    if (sererResponse.success) {
      callbackOnSuccess();
      displayNotif('Added a new post.', 'success');
    } else {
      callbackOnFail();
      displayNotif('Failed to add a new post.', 'error');
      console.log(sererResponse.message);
    }
  }
}

export const PostConverter = {
  toFirestore(value: WithFieldValue<PostModel>) {
    return value;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    return new PostModel({ id: snapshot.id, ...snapshot.data(options) });
  },
};
