export function shortenString(s: string, length: number): string {
    if (s.length <= length) return s;

    // remove last 3 letters
    let shortStr = s.substr(0, length - 3);

    // remove white space at the end
    if (shortStr.charAt(shortStr.length - 1) === ' ')
        shortStr = shortStr.slice(0, shortStr.length - 1);

    return shortStr + '...';
}
