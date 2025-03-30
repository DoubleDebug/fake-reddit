import {
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  WithFieldValue,
} from 'firebase/firestore';

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

export const CommentConverter = {
  toFirestore(value: WithFieldValue<CommentModel>) {
    return value;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    return new CommentModel({ id: snapshot.id, ...snapshot.data(options) });
  },
};
