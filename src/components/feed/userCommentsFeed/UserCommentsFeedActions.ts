import { CommentModel } from '../../../models/comment';

export function filterComments(posts: CommentModel[]) {
  // remove duplicates
  const uniqueIds = Array.from(new Set(posts.map((p) => p.id)));
  const uniquePosts = uniqueIds.map(
    (id) => posts.filter((p) => p.id === id)[0],
  );

  // remove skeletons
  return uniquePosts.filter((p) => p.id);
}
