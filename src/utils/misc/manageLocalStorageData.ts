import { log } from './log';

export async function getCachedData(
  localStorageItemName: string,
  keyToGet: string,
  fetchCallback: (k: string) => Promise<string | null | undefined>,
  keyName: string = 'key',
  valueName: string = 'value',
): Promise<string | undefined> {
  try {
    // get cached data if possible
    let map: any = localStorage.getItem(localStorageItemName);
    if (!map) throw Error('No cached data found.');
    map = JSON.parse(map);
    const record = map.filter((r: any) => r[keyName] === keyToGet);
    if (!record || !record[0] || !record[0][valueName])
      throw new Error('No record found in local storage.');

    return record[0][valueName];
  } catch {
    log(
      `Reading '${localStorageItemName}' from cache failed.
            Now fetching data from the database.`,
    );

    // get data from db
    const data = await fetchCallback(keyToGet);
    if (data) {
      // persist data in local storage
      const previousRecords = localStorage.getItem(localStorageItemName);
      const recordToAdd: any = {};
      recordToAdd[keyName] = keyToGet;
      recordToAdd[valueName] = data;

      if (previousRecords) {
        const data = JSON.stringify([
          ...JSON.parse(previousRecords).filter(
            (r: any) => r[keyName] !== keyToGet, // avoid duplicates
          ),
          recordToAdd,
        ]);
        localStorage.setItem(localStorageItemName, data);
      } else {
        const data = JSON.stringify([recordToAdd]);
        localStorage.setItem(localStorageItemName, data);
      }

      return data;
    }

    return;
  }
}

export function updateCachedData(
  localStorageItemName: string,
  keyToUpdate: string,
  valueToUpdate: string,
  keyName: string = 'key',
  valueName: string = 'value',
): boolean {
  try {
    // check if item exists in cache
    let map: any = localStorage.getItem(localStorageItemName);
    if (!map) throw Error('No cached data found.');
    map = JSON.parse(map);
    const record = map.filter((r: any) => r[keyName] === keyToUpdate);
    if (!record || !record[0] || !record[0][valueName])
      throw new Error('No record found in local storage.');

    // replace item with new value
    map = map.filter((r: any) => r[keyName] !== keyToUpdate);
    const replacement: any = {};
    replacement[keyName] = keyToUpdate;
    replacement[valueName] = valueToUpdate;
    map.push(replacement);
    localStorage.setItem(localStorageItemName, JSON.stringify(map));
    return true;
  } catch {
    log(`Failed to update '${localStorageItemName}' record.`);
    return false;
  }
}
