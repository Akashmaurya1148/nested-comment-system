import React, { useState } from "react";

export function CommentForm({
  loading,
  error,
  onSubmit,
  autoFocus = false,
  initialValue = "",
}) {
  const [text, setText] = useState(initialValue);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    onSubmit(text).then(() => setText(""));
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="bg-white/50 rounded-xl p-6 border border-white/30">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <textarea
              autoFocus={autoFocus}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
              rows="4"
              placeholder="Share your thoughts..."
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {text.length}/500
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              type="submit"
              disabled={loading || !text.trim()}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Posting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span>Post Comment</span>
                </div>
              )}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-600 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
