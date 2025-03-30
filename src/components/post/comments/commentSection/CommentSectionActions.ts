export function toggleCommentReplies(
  commentId: string | undefined,
  hiddenComments: string[],
  setHiddenComments: (p: string[]) => void,
) {
  if (!commentId) return;
  if (hiddenComments.includes(commentId)) {
    setHiddenComments(hiddenComments.filter((c) => c !== commentId));
    return;
  }

  setHiddenComments([...hiddenComments, commentId]);
}
