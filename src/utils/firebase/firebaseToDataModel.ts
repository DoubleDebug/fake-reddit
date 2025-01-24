import { PostModel } from '../../models/post';
import { Timestamp } from 'firebase/firestore';
import { CommentModel } from '../../models/comment';

export function convertToPost(data: any): PostModel {
  data.createdAt = convertJsonToTimestamp(data.createdAt);
  return new PostModel(data as Partial<PostModel>);
}
export function convertToComment(data: any): CommentModel {
  data.createdAt = convertJsonToTimestamp(data.createdAt);
  return new CommentModel(data as Partial<CommentModel>);
}

function convertJsonToTimestamp(data: any): Timestamp {
  const seconds = data?._seconds || Timestamp.now().seconds;
  const nanoseconds = data?._nanoseconds || Timestamp.now().nanoseconds;
  return new Timestamp(seconds, nanoseconds);
}
