export type PollVote = { uid: string; choice: string };

export class PollModel {
    options: string[] = ['', '', ''];
    votes: PollVote[] = [];

    constructor(init?: Partial<PollModel>) {
        Object.assign(this, init);

        // always at least 2 options
        while (this.options.length < 2) this.options.push('');
    }

    getResults() {
        return {};
    }
}
