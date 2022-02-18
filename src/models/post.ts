import {
    doc,
    Firestore,
    Timestamp,
    updateDoc,
    increment,
} from '@firebase/firestore';
import { User } from 'firebase/auth';
import { DB_COLLECTIONS } from '../utils/misc/constants';
import { deletePost } from '../utils/firebase/deletePost';
import { displayNotif } from '../utils/misc/toast';
import { PollModel } from './poll';

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

    upvote(firestore: Firestore, uid: string) {
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

        updateDoc(doc(firestore, DB_COLLECTIONS.POSTS, this.id), {
            votes: this.votes,
        });
    }

    downvote(firestore: Firestore, uid: string) {
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

        updateDoc(doc(firestore, DB_COLLECTIONS.POSTS, this.id), {
            votes: this.votes,
        });
    }

    async delete(user: User, firestore: Firestore, subreddit: string) {
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
        updateDoc(
            doc(firestore, DB_COLLECTIONS.METADATA, 'numOfPosts'),
            counters
        );
    }
}
