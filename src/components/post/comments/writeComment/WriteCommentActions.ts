import { User } from 'firebase/auth';
import {
    Timestamp,
    addDoc,
    collection,
    getFirestore,
} from 'firebase/firestore';
import { validateComment } from '../../../../utils/dataValidation/validateComment';
import { DB_COLLECTIONS } from '../../../../utils/misc/constants';
import { displayNotif, displayNotifJSX } from '../../../../utils/misc/toast';
import { signInPopup } from '../../../../utils/signInPopup/SignInPopup';

export function submitComment(
    e: React.MouseEvent,
    user: User | null | undefined,
    comment: string,
    setComment: (c: string) => void,
    parentCommentId: string | undefined,
    postId: string,
    setIsSubmitting: (s: boolean) => void
) {
    e.preventDefault();

    if (!user) {
        displayNotifJSX(() => signInPopup('write a comment'));
        return;
    }

    // data validation
    const validationResult = validateComment(comment);
    if (!validationResult.success) {
        displayNotif(validationResult.message, 'error');
        return;
    }

    // gathering data
    setIsSubmitting(true);
    let data: any = {
        author: user.displayName,
        authorId: user.uid,
        createdAt: Timestamp.now(),
        isReply: parentCommentId ? true : false,
        postId: postId,
        text: comment,
    };

    if (parentCommentId) {
        data = { ...data, parentCommentId: parentCommentId };
    }

    // submitting data to firestore
    const db = getFirestore();
    addDoc(collection(db, DB_COLLECTIONS.COMMENTS), data).then(() => {
        setComment('');
        setIsSubmitting(false);
    });
}
