import { makeRequest } from "./makeRequest";

export function createComment({ postId, text, parentId }) {
  return makeRequest(`posts/${postId}/comments`, {
    method: "POST",
    data: { text, parentId },
  });
}

export function updateComment({ postId, text, id }) {
  return makeRequest(`posts/${postId}/comments/${id}`, {
    method: "PUT",
    data: { text },
  });
}

export function deleteComment({ postId, id }) {
  return makeRequest(`posts/${postId}/comments/${id}`, {
    method: "DELETE",
  });
}

export function upvoteComment({ id, postId }) {
  return makeRequest(`posts/${postId}/comments/${id}/upvote`, {
    method: "POST",
  });
}
