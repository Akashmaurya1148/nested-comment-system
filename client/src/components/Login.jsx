import React, { useState } from "react";
import { login } from "../services/auth";

export function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({ email, password });
      onLogin(response.user);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 px-4">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-indigo-100">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-indigo-700">
            Welcome Back 👋
          </h2>
          <p className="mt-2 text-gray-600 text-sm">
            Sign in with an allowed email domain <br />
            <span className="text-indigo-500 font-medium">
              (gmail.com, yahoo.com, outlook.com, test.com)
            </span>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-pulse">Signing in...</span>
            ) : (
              "Sign in"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center my-3">
            <span className="h-px bg-gray-200 w-1/3"></span>
            <span className="px-2 text-gray-400 text-sm">or</span>
            <span className="h-px bg-gray-200 w-1/3"></span>
          </div>

          {/* Extra Links */}
          <div className="text-center text-sm text-gray-500">
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Forgot password?
            </a>
            {" • "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Create account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
