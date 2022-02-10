import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export async function getImageURL(storagePath: string): Promise<string> {
    return await getDownloadURL(ref(getStorage(), storagePath));
}
