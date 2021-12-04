import { Data } from 'react-firebase-hooks/firestore/dist/firestore/types';
import { PostModel } from '../models/post';

export function convertToPost(data: Data): PostModel {
    return new PostModel(data as Partial<PostModel>);
}
