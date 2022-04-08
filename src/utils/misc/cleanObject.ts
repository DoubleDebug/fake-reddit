/**
 * Removes all undefined fields from the object
 */
export function cleanObject(obj: any) {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
}

/**
 * Removes all functions from the object
 */
export function cleanObjectFunctions(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}
