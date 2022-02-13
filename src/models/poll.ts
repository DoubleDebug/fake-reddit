export type PollVote = { uid: string; choice: string };

export class PollModel {
    options: string[] = ['', ''];
    votes: PollVote[] = [];

    constructor(init?: Partial<PollModel>) {
        Object.assign(this, init);
    }

    getResults() {
        return {};
    }
}
