export type PollVote = { uid: string; option: string };

export class PollModel {
    options: string[] = ['Option 1', 'Option 2', 'Option 3'];
    votes: PollVote[] = [];

    constructor(init?: Partial<PollModel>) {
        Object.assign(this, init);

        // always at least 2 options
        let len = this.options.length;
        while (len < 2) this.options.push(`Option ${len++}`);
    }

    add(item?: string) {
        if (!item) {
            this.options.push(`Option ${this.options.length + 1}`);
            return new PollModel({ ...this });
        }
        if (!this.options.includes(item)) this.options.push(item);
        return new PollModel({ ...this });
    }

    update(index: number, newValue: string) {
        if (!this.options.includes(newValue)) this.options[index] = newValue;

        return new PollModel({ ...this });
    }

    remove(index: number) {
        this.options.splice(index, 1);
        return new PollModel({ ...this });
    }

    validateNewOption(newOption: string): ResponseStatus {
        if (this.options.includes(newOption)) {
            return {
                success: false,
                message: 'Poll cannot have 2 identical options.',
            };
        }

        if (newOption.length > 60) {
            return {
                success: false,
                message: 'Option is too long.',
            };
        }

        return {
            success: true,
        };
    }

    getResults() {
        // calculate results
        const results = [];
        for (let i = 0; i < this.options.length; i++) {
            const option = this.options[i];
            const numOfVotes = this.votes.filter(
                (v) => v.option === option
            ).length;
            const percentage = (numOfVotes / this.votes.length) * 100;
            results.push({
                option: option,
                numOfVotes: numOfVotes,
                percentage: Math.floor(percentage),
            });
        }

        // find winner
        const vals = results.map((r) => r.percentage);
        const winnerIndex = vals.indexOf(Math.max(...vals));
        let winner: string | null = results[winnerIndex].option;

        if (this.checkIfResultsAreTied(results)) winner = null;

        return {
            winner: winner,
            results: results,
        };
    }

    private checkIfResultsAreTied(
        results: {
            option: string;
            numOfVotes: number;
            percentage: number;
        }[]
    ): boolean {
        // find winner
        const vals = results.map((r) => r.percentage);
        const winnerIndex = vals.indexOf(Math.max(...vals));
        const winner = results[winnerIndex];

        // check if any other option has same num of votes
        let i = 0;
        while (i < results.length) {
            if (results[i].option === winner.option) {
                i++;
                continue;
            }

            if (results[i].numOfVotes === winner.numOfVotes) {
                return true;
            }

            i++;
        }

        return false;
    }
}
