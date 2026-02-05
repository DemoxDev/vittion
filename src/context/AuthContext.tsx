/**
 * Authentication Context with GitHub OAuth, JWT tokens, and automatic refresh.
 *
 * Provides seamless authentication that refreshes tokens transparently
 * before they expire, preventing any user interruption.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface User {
  id: string;
  username: string;
  name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage keys
const ACCESS_TOKEN_KEY = "vittion_access_token";
const REFRESH_TOKEN_KEY = "vittion_refresh_token";
const TOKEN_EXPIRY_KEY = "vittion_token_expiry";

// Parse JWT to get expiry without validation
function parseJwt(token: string): { exp: number } | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTimeoutId, setRefreshTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Store tokens in localStorage
  const storeTokens = useCallback(
    (accessToken: string, refreshToken: string, expiresIn: number) => {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      const expiry = Date.now() + expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
    },
    [],
  );

  // Clear tokens
  const clearTokens = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }, []);

  // Refresh the access token
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        clearTokens();
        return false;
      }

      const data = await response.json();
      storeTokens(data.access_token, data.refresh_token, data.expires_in);
      return true;
    } catch {
      clearTokens();
      return false;
    }
  }, [clearTokens, storeTokens]);

  // Schedule token refresh 1 minute before expiry
  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
    }

    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return;

    const expiryTime = parseInt(expiry, 10);
    const now = Date.now();
    // Refresh 1 minute before expiry
    const refreshTime = expiryTime - now - 60000;

    if (refreshTime <= 0) {
      // Token is about to expire or expired, refresh now
      refreshAccessToken();
    } else {
      const timeoutId = setTimeout(async () => {
        const success = await refreshAccessToken();
        if (success) {
          scheduleTokenRefresh();
        } else {
          setUser(null);
        }
      }, refreshTime);
      setRefreshTimeoutId(timeoutId);
    }
  }, [refreshTimeoutId, refreshAccessToken]);

  // Get a valid access token, refreshing if needed
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (!accessToken || !expiry) return null;

    const expiryTime = parseInt(expiry, 10);
    const now = Date.now();

    // If token expires in less than 30 seconds, refresh it
    if (expiryTime - now < 30000) {
      const success = await refreshAccessToken();
      if (!success) return null;
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    return accessToken;
  }, [refreshAccessToken]);

  // Fetch user info from /auth/me
  const fetchUser = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        scheduleTokenRefresh();
      } else {
        clearTokens();
        setUser(null);
      }
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [getAccessToken, clearTokens, scheduleTokenRefresh]);

  // Handle OAuth callback tokens from URL fragment
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const expiresIn = params.get("expires_in");

      if (accessToken && refreshToken && expiresIn) {
        storeTokens(accessToken, refreshToken, parseInt(expiresIn, 10));
        // Clean up URL
        window.history.replaceState(null, "", window.location.pathname);
      }
    }

    fetchUser();

    // Cleanup timeout on unmount
    return () => {
      if (refreshTimeoutId) {
        clearTimeout(refreshTimeoutId);
      }
    };
  }, []);

  // Login - redirect to GitHub OAuth
  const login = useCallback(() => {
    window.location.href = `${API_BASE_URL}/auth/login`;
  }, []);

  // Logout - clear tokens and call backend
  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      } catch {
        // Ignore logout errors
      }
    }

    clearTokens();
    setUser(null);

    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
      setRefreshTimeoutId(null);
    }
  }, [clearTokens, refreshTimeoutId]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
