export function removeDuplicates<T>(array: Array<T>) {
  return Array.from(new Set(array));
}
