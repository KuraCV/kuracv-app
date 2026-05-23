"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, AUTH_SESSION_EXPIRED_EVENT, ApiError } from "@/utils/api";

export interface UserProfile {
  id?: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Safely decodes a JWT token payload on the client side
 */
function decodeJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT decoding failed:", e);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  // Load tokens and user on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedAccess = localStorage.getItem("access_token");
        const storedRefresh = localStorage.getItem("refresh_token");
        const storedUser = localStorage.getItem("user_info");

        if (storedAccess && storedRefresh) {
          setAccessToken(storedAccess);
          
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Attempt to reconstruct user from JWT access token
            const decoded = decodeJwt(storedAccess);
            if (decoded) {
              const decodedUser: UserProfile = {
                id: decoded.user_id,
                email: decoded.email || "",
                username: decoded.username || (decoded.email ? decoded.email.split("@")[0] : "User"),
              };
              setUser(decodedUser);
              localStorage.setItem("user_info", JSON.stringify(decodedUser));
            } else {
              setUser({ username: "User", email: "" });
            }
          }
        }
      } catch (err) {
        console.error("Failed to initialize auth state:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for global session expiration events from apiFetch interceptor
    const handleSessionExpired = () => {
      setUser(null);
      setAccessToken(null);
      setAuthError("Your session has expired. Please log in again.");
      router.push("/login");
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [router]);

  const clearError = () => setAuthError(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response: any = await apiFetch("/api/accounts/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const { access, refresh, user: returnedUser } = response;

      if (!access || !refresh) {
        throw new Error("Missing auth tokens in server response.");
      }

      // Save tokens
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      setAccessToken(access);

      // Save user
      let finalUser: UserProfile;
      if (returnedUser) {
        finalUser = {
          id: returnedUser.id,
          username: returnedUser.username,
          email: returnedUser.email,
        };
      } else {
        // Decode access token to retrieve user details if not returned directly
        const decoded = decodeJwt(access);
        finalUser = {
          id: decoded?.user_id || 0,
          username: decoded?.username || email.split("@")[0],
          email: decoded?.email || email,
        };
      }

      localStorage.setItem("user_info", JSON.stringify(finalUser));
      setUser(finalUser);

      // Navigate to main app
      router.push("/jobs");
    } catch (err) {
      console.error("Login failed:", err);
      if (err instanceof ApiError) {
        setAuthError(err.data.detail || err.data.error || "Invalid email or password.");
      } else {
        setAuthError((err as Error).message || "An unexpected error occurred during login.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // The API register endpoint expects "username", "email", and "password"
      const response: any = await apiFetch("/api/accounts/register/", {
        method: "POST",
        body: JSON.stringify({
          username: fullName,
          email: email,
          password: password,
        }),
      });

      // If the register endpoint returns tokens directly, auto-login the user
      if (response && response.access && response.refresh) {
        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);
        setAccessToken(response.access);

        const finalUser: UserProfile = response.user || {
          username: fullName,
          email: email,
        };
        localStorage.setItem("user_info", JSON.stringify(finalUser));
        setUser(finalUser);
        router.push("/jobs");
      } else {
        // Otherwise, redirect to login page
        router.push("/login?registered=true");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      if (err instanceof ApiError) {
        const errorDetail = err.data.detail || err.data.error;
        if (errorDetail) {
          setAuthError(errorDetail);
        } else {
          // Flatten dictionary-based field errors (e.g. {"username": ["This field must be unique."]})
          const fieldErrors = Object.entries(err.data)
            .map(([field, msgs]) => {
              const formattedMsgs = Array.isArray(msgs) ? msgs.join(" ") : String(msgs);
              return `${field.charAt(0).toUpperCase() + field.slice(1)}: ${formattedMsgs}`;
            })
            .join(" | ");
          setAuthError(fieldErrors || "Registration failed. Please check your credentials.");
        }
      } else {
        setAuthError((err as Error).message || "An unexpected error occurred during registration.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_info");
    } catch (err) {
      console.error("Error clearing local storage:", err);
    }
    setAccessToken(null);
    setUser(null);
    setAuthError(null);
    router.push("/login");
  };

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const response: any = await apiFetch("/api/accounts/google/", {
        method: "POST",
        body: JSON.stringify({ credential }),
      });

      const { access, refresh, user: returnedUser } = response;

      if (!access || !refresh) {
        throw new Error("Missing auth tokens in server response.");
      }

      // Save tokens
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      setAccessToken(access);

      // Save user
      let finalUser: UserProfile;
      if (returnedUser) {
        finalUser = {
          id: returnedUser.id,
          username: returnedUser.username,
          email: returnedUser.email,
        };
      } else {
        // Decode access token to retrieve user details if not returned directly
        const decoded = decodeJwt(access);
        finalUser = {
          id: decoded?.user_id || 0,
          username: decoded?.username || decoded?.email?.split("@")[0] || "User",
          email: decoded?.email || "",
        };
      }

      localStorage.setItem("user_info", JSON.stringify(finalUser));
      setUser(finalUser);

      // Navigate to main app
      router.push("/jobs");
    } catch (err) {
      console.error("Google login failed:", err);
      if (err instanceof ApiError) {
        setAuthError(err.data.detail || err.data.error || "Google authentication failed.");
      } else {
        setAuthError((err as Error).message || "An unexpected error occurred during Google login.");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken,
        isLoading,
        authError,
        login,
        loginWithGoogle,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
