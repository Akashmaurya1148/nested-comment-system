import React, { useState } from "react";
import { usePost } from "../contexts/PostContext";
import { useAsyncFn } from "../hooks/useAsync";
import {
  createComment,
  updateComment,
  deleteComment,
  upvoteComment,
} from "../services/comments";
import { CommentForm } from "./CommentForm";

export function Comment({ comment, depth = 0 }) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {
    post,
    getReplies,
    createLocalComment,
    updateLocalComment,
    deleteLocalComment,
  } = usePost();

  const createCommentFn = useAsyncFn(createComment);
  const updateCommentFn = useAsyncFn(updateComment);
  const deleteCommentFn = useAsyncFn(deleteComment);
  const upvoteCommentFn = useAsyncFn(upvoteComment);

  const childComments = getReplies(comment.id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  function onCommentReply(text) {
    return createCommentFn
      .execute({ postId: post.id, text, parentId: comment.id })
      .then((newComment) => {
        setIsReplying(false);
        createLocalComment(newComment);
      });
  }

  function onCommentUpdate(text) {
    return updateCommentFn
      .execute({ postId: post.id, text, id: comment.id })
      .then(() => {
        setIsEditing(false);
        updateLocalComment(comment.id, text);
      });
  }

  function onCommentDelete() {
    return deleteCommentFn
      .execute({ postId: post.id, id: comment.id })
      .then(() => deleteLocalComment(comment.id));
  }

  function onUpvote() {
    return upvoteCommentFn
      .execute({ id: comment.id, postId: post.id })
      .then(() => {
        // Update local upvote count
        updateLocalComment(comment.id, comment.text, comment.upvotes + 1);
      });
  }

  // Maximum depth to prevent infinite nesting
  const maxDepth = 5;
  const shouldShowReply = depth < maxDepth;

  return (
    <div
      className={`comment ${
        depth > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""
      }`}
    >
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        {/* Comment Header */}
        <div className="flex items-center space-x-3 mb-3">
          {comment.user.avatar && (
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">
                {comment.user.name}
              </span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={comment.text}
            onSubmit={onCommentUpdate}
            loading={updateCommentFn.loading}
            error={updateCommentFn.error}
          />
        ) : (
          <div className="text-gray-700 mb-3">{comment.text}</div>
        )}

        {/* Comment Actions */}
        <div className="flex items-center space-x-4 text-sm">
          <button
            onClick={onUpvote}
            disabled={upvoteCommentFn.loading}
            className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 disabled:opacity-50"
          >
            <span>👍</span>
            <span>{comment.upvotes}</span>
          </button>

          {shouldShowReply && (
            <button
              onClick={() => setIsReplying((prev) => !prev)}
              className="text-gray-500 hover:text-indigo-600"
            >
              {isReplying ? "Cancel" : "Reply"}
            </button>
          )}

          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="text-gray-500 hover:text-indigo-600"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          <button
            onClick={onCommentDelete}
            disabled={deleteCommentFn.loading}
            className="text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>

        {deleteCommentFn.error && (
          <div className="mt-2 text-red-600 text-sm">
            {deleteCommentFn.error}
          </div>
        )}
      </div>

      {/* Reply Form */}
      {isReplying && (
        <div className="mb-4">
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            loading={createCommentFn.loading}
            error={createCommentFn.error}
          />
        </div>
      )}

      {/* Child Comments */}
      {childComments?.length > 0 && (
        <>
          <div
            className={`nested-comments ${areChildrenHidden ? "hidden" : ""}`}
          >
            <button
              className="mb-2 text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() => setAreChildrenHidden(true)}
            >
              Hide Replies ({childComments.length})
            </button>
            <div className="space-y-2">
              {childComments.map((childComment) => (
                <Comment
                  key={childComment.id}
                  comment={childComment}
                  depth={depth + 1}
                />
              ))}
            </div>
          </div>
          {areChildrenHidden && (
            <button
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() => setAreChildrenHidden(false)}
            >
              Show Replies ({childComments.length})
            </button>
          )}
        </>
      )}
    </div>
  );
}
