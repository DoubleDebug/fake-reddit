/**
 * @returns string where the first letter is uppercased
 * (e.g. people --> People)
 */

export function toUppercaseFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
