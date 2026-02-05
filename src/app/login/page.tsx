/**
 * Login page with GitHub OAuth button.
 * Handles OAuth callback by reading tokens from URL fragment.
 */

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from state, or default to /dashboard
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="w-full max-w-md p-8">
        <div className="bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-neutral-800 shadow-2xl p-8">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Vittion
            </h1>
            <p className="text-neutral-400 mt-2">
              Sign in to access the dashboard
            </p>
          </div>

          {/* GitHub Login Button */}
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-neutral-700"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Continue with GitHub
          </button>

          {/* Info */}
          <p className="text-xs text-neutral-500 text-center mt-6">
            Only authorized users can access the dashboard.
            <br />
            Contact your administrator for access.
          </p>
        </div>

        {/* Error handling */}
        {new URLSearchParams(window.location.search).get("error") && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm text-center">
            Authentication failed. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
