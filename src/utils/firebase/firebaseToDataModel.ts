import { Timestamp } from 'firebase/firestore';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { CommentModel } from '../../models/comment';
import { PostModel } from '../../models/post';

export function convertToPost(data: Data): PostModel {
    data.createdAt = convertJsonToTimestamp(data.createdAt);
    return new PostModel(data as Partial<PostModel>);
}
export function convertToComment(data: Data): CommentModel {
    data.createdAt = convertJsonToTimestamp(data.createdAt);
    return new CommentModel(data as Partial<CommentModel>);
}

function convertJsonToTimestamp(data: any): Timestamp {
    const seconds = data._seconds || Timestamp.now().seconds;
    const nanoseconds = data._nanoseconds || Timestamp.now().nanoseconds;
    return new Timestamp(seconds, nanoseconds);
}
