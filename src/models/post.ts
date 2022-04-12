import {
    doc,
    Timestamp,
    updateDoc,
    increment,
    getFirestore,
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
    content: string = '';
    author: string = '';
    authorId: string | undefined | null;
    createdAt: Timestamp = Timestamp.now();
    votes: IVote[] = [];
    subreddit: string = 'all';
    contentFiles?: string[] = [];
    pollData?: PollModel;
    flairs?: string[] = [];

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

        if (usersVote === null) {
            this.votes.push({
                uid: uid,
                upvoted: true,
            });
        } else if (usersVote === true) {
            this.votes = this.votes.filter((v) => v.uid !== uid);
        } else {
            this.votes = this.votes.filter((v) => v.uid !== uid);
            this.votes.push({
                uid: uid,
                upvoted: true,
            });
        }

        const db = getFirestore();
        updateDoc(doc(db, DB_COLLECTIONS.POSTS, this.id), {
            votes: this.votes,
        });
    }

    downvote(uid: string) {
        if (!this.id) return;
        const usersVote = this.getUsersVote(uid);

        if (usersVote === null) {
            this.votes.push({
                uid: uid,
                upvoted: false,
            });
        } else if (usersVote === true) {
            this.votes = this.votes.filter((v) => v.uid !== uid);
            this.votes.push({
                uid: uid,
                upvoted: false,
            });
        } else {
            this.votes = this.votes.filter((v) => v.uid !== uid);
        }

        const db = getFirestore();
        updateDoc(doc(db, DB_COLLECTIONS.POSTS, this.id), {
            votes: this.votes,
        });
    }

    async delete(user: User, subreddit: string) {
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

        // update metadata counters
        const counters: any = {
            all: increment(-1),
        };
        if (subreddit !== 'all') counters[subreddit] = increment(-1);

        const db = getFirestore();
        updateDoc(doc(db, DB_COLLECTIONS.METADATA, 'numOfPosts'), counters);
    }

    async submit(
        user: User,
        subreddit: string,
        callbackOnInvalidData: () => void,
        callbackOnSuccess: () => void,
        callbackOnFail: () => void
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
            subreddit: subreddit,
        };
        postObject = cleanObject(postObject); // remove all empty fields from post data

        // send data to firestore
        const postRes = await submitPost(user, postObject);

        if (postRes.success) {
            callbackOnSuccess();
            displayNotif('Added a new post.', 'success');
        } else {
            callbackOnFail();
            displayNotif('Failed to add a new post.', 'error');
            console.log(postRes.message);
        }
    }
}
