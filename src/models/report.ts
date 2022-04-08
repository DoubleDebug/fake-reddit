import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { cleanObjectFunctions } from '../utils/misc/cleanObject';
import { DB_COLLECTIONS, TYPES_OF_VIOLATION } from '../utils/misc/constants';

export class Report {
    type: 'user' | 'post';
    authorId: string;
    contentId: string;
    violations: typeof TYPES_OF_VIOLATION[number][];
    note: string;

    constructor(
        type: 'user' | 'post',
        authorId: string,
        contentId: string,
        violations: typeof TYPES_OF_VIOLATION[number][],
        note: string
    ) {
        this.type = type;
        this.authorId = authorId;
        this.contentId = contentId;
        this.violations = violations;
        this.note = note;
    }

    async submit() {
        const db = getFirestore();
        const collectionRef = collection(db, DB_COLLECTIONS.REPORTS);
        return await addDoc(collectionRef, cleanObjectFunctions(this));
    }
}
