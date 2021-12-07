import {
    deleteDoc,
    doc,
    Firestore,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';

interface IVote {
    uid: string;
    upvoted: boolean;
}

export class PostModel {
    id: string | undefined = undefined;
    title: string = '';
    content: string = '';
    author: string = '';
    authorId: string | undefined | null;
    createdAt: Timestamp = Timestamp.now();
    votes: IVote[] = [];

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

        updateDoc(doc(firestore, 'posts', this.id), {
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

        updateDoc(doc(firestore, 'posts', this.id), {
            votes: this.votes,
        });
    }

    delete(firestore: Firestore) {
        if (!this.id) return;
        deleteDoc(doc(firestore, 'posts', this.id));
    }
}
