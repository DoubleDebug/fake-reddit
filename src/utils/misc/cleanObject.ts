/**
 * Removes all undefined fields from the object
 */
export function cleanObject(obj: any) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
}
