import { Timestamp } from 'firebase/firestore';

export class CommentModel {
    id: string | undefined;
    postId: string = '';
    author: string = '';
    authorId: string | undefined;
    createdAt: Timestamp = Timestamp.now();
    text: string = '';
    isReply: boolean = false;
    parentCommentId: string | undefined;

    constructor(init?: Partial<CommentModel>) {
        Object.assign(this, init);
    }
}
