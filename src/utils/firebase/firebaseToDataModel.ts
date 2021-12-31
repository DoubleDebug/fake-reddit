import { Timestamp } from 'firebase/firestore';
import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { PostModel } from '../../models/post';

export function convertToPost(data: Data): PostModel {
    data.createdAt = convertJsonToTimestamp(data.createdAt);
    return new PostModel(data as Partial<PostModel>);
}

function convertJsonToTimestamp(data: any): Timestamp {
    const seconds = data._seconds || Timestamp.now().seconds;
    const nanoseconds = data._nanoseconds || Timestamp.now().nanoseconds;
    return new Timestamp(seconds, nanoseconds);
}
