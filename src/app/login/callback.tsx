/**
 * OAuth callback page that handles token extraction from URL fragment.
 * Automatically redirects to dashboard after storing tokens.
 */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // The AuthContext handles token extraction from URL fragment
    // We just need to wait a moment then redirect
    const timer = setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <p className="text-neutral-400">Completing sign in...</p>
      </div>
    </div>
  );
}
