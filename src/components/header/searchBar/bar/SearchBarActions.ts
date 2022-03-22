export function validateQuery(
    query: string,
    setDisplayHits: (v: boolean) => void
) {
    if (query.length > 2) setDisplayHits(true);
    else setDisplayHits(false);
}
