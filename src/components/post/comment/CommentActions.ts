import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { CommentModel } from '../../../models/comment';
import { DB_COLLECTIONS } from '../../../utils/misc/constants';

export function deleteComment(data: CommentModel) {
    if (!data.id) return;
    const db = getFirestore();
    deleteDoc(doc(db, DB_COLLECTIONS.COMMENTS, data.id));
}
