import React from "react";
import { Link } from "react-router-dom";
import { usePost } from "../contexts/PostContext";
import { useAsyncFn } from "../hooks/useAsync";
import { createComment } from "../services/comments";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

export function Post() {
  const { post, rootComments, createLocalComment } = usePost();
  const {
    loading,
    error,
    execute: createCommentFn,
  } = useAsyncFn(createComment);

  function onCommentCreate(text) {
    return createCommentFn({ postId: post.id, text }).then(createLocalComment);
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Posts
        </Link>
      </div>

      {/* Post Header */}
      <article className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-white/20">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(post.createdAt)}</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
          {post.body}
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Join the Discussion
          </h3>
        </div>

        <CommentForm
          loading={loading}
          error={error}
          onSubmit={onCommentCreate}
        />

        {rootComments != null && rootComments.length > 0 && (
          <div className="mt-8">
            <CommentList comments={rootComments} />
          </div>
        )}
      </div>
    </div>
  );
}
