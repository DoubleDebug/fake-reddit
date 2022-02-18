import { FirebaseError } from 'firebase/app';
import { User } from 'firebase/auth';
import {
    Timestamp,
    increment,
    getFirestore,
    addDoc,
    collection,
    updateDoc,
    doc,
} from 'firebase/firestore';
import { FileInfo } from '../../components/newPost/imageUploader/DragAndDrop';
import { PostModel } from '../../models/post';
import { cleanObject } from '../../utils/misc/cleanObject';
import { DB_COLLECTIONS } from '../../utils/misc/constants';
import { validatePostData } from '../../utils/dataValidation/validatePostData';
import { deleteFile } from '../../utils/firebase/deleteFile';
import { isFileImage, isFileVideo } from '../../utils/misc/getFileExtension';
import { displayNotif } from '../../utils/misc/toast';

// TODO
export function handleCancelledSubmission(
    contentFiles: string[],
    postStage: 'default' | 'being-submitted' | 'submitted',
    user: User
) {
    if (!contentFiles) return;
    if (contentFiles.length === 0) return;
    if (postStage !== 'default') return;

    // If a post submission is cancelled, delete uploaded file
    contentFiles.forEach((file) => {
        if (!user) return;
        deleteFile(user, file).then((res) => {
            if (!res.success) displayNotif(res.message, 'error');
        });
    });
}

export function submitNewPost(
    e: React.MouseEvent,
    user: User | null | undefined,
    postData: PostModel,
    setPostStage: (s: 'default' | 'being-submitted' | 'submitted') => void,
    subredditInput: any
) {
    e.preventDefault();
    if (!user) return;

    // loading animation
    setPostStage('being-submitted');

    // data validation
    const validationResponse = validatePostData(postData);
    if (!validationResponse.success) {
        setPostStage('default');
        displayNotif(validationResponse.message, 'error');
        return;
    }

    // prepare data
    const sub = subredditInput.getValue()[0].value;
    let postObject: any = {
        ...postData,
        createdAt: Timestamp.now(),
        subreddit: sub,
    };
    postObject = cleanObject(postObject); // remove all empty fields from post data
    const counters: any = {
        all: increment(1),
    };
    if (sub !== 'all') counters[sub] = increment(1);

    // send data to firestore
    const db = getFirestore();
    addDoc(collection(db, DB_COLLECTIONS.POSTS), postObject)
        .then(() => {
            updateDoc(doc(db, DB_COLLECTIONS.METADATA, 'numOfPosts'), counters);

            setPostStage('submitted');
            displayNotif('Added a new post.', 'success');
        })
        .catch((error: FirebaseError) => {
            setPostStage('default');
            console.log(error);
            displayNotif('Failed to add a new post.', 'error');
        });
}

export function handleTabChange(
    tabNumber: string,
    setTabIndex: (t: string) => void
) {
    setTabIndex(tabNumber);
}

export function getFileMarkup(fileInfo: FileInfo) {
    if (isFileImage(fileInfo.fileName)) return `<img src=${fileInfo.url}/>`;

    if (isFileVideo(fileInfo.fileName))
        return `<video src=${fileInfo.url} controls loop></video>`;

    return '';
}
