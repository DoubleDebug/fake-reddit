type Results = {
  winner: string | null;
  results: {
    option: string;
    numOfVotes: number;
    percentage: number;
  }[];
};

export function getSpecificResult(results: Results, option: string) {
  return results.results.filter((r) => r.option === option)[0];
}
