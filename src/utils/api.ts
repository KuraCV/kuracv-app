/**
 * KuraCV API Client Utility
 * Provides standard wrapper around window.fetch with JWT injection
 * and automatic 401 Unauthorized token refreshing.
 */

// Get API base URL from runtime config (client-side) or env var (build-time/server-side)
export const BASE_URL = (() => {
  if (typeof window !== "undefined") {
    // Client-side: use the runtime config loaded from config.js
    return (window as any).__API_BASE_URL || "http://localhost:8000";
  }
  // Server-side: use build-time env var or default
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
})();

// Helper to determine if code is running on the client side
const isClient = () => typeof window !== "undefined";

// Custom event name for session expiration
export const AUTH_SESSION_EXPIRED_EVENT = "kuracv-auth-session-expired";

export interface ApiErrorResponse {
  detail?: string;
  messages?: Array<{ message: string; field?: string }>;
  [key: string]: any;
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorResponse;

  constructor(status: number, data: ApiErrorResponse) {
    super(data.detail || `API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/**
 * Perform a token refresh operation
 */
async function performTokenRefresh(refreshToken: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/accounts/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Token refresh request failed");
  }

  const data = await response.json();
  if (!data.access) {
    throw new Error("Invalid token refresh response: missing access token");
  }

  return data.access;
}

/**
 * Standard fetch wrapper for KuraCV API
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  // Clone options and headers so we don't modify the caller's arguments
  const requestOptions: RequestInit = { ...options };
  const headers = new Headers(requestOptions.headers);

  // Set default content type to JSON if not specified and body exists
  if (!headers.has("Content-Type") && requestOptions.body && !(requestOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Inject JWT Bearer access token if stored
  if (isClient()) {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  requestOptions.headers = headers;

  try {
    const response = await fetch(url, requestOptions);

    if (response.ok) {
      // 204 No Content has no JSON body
      if (response.status === 204) {
        return {} as T;
      }
      return await response.json();
    }

    // Handle 401 Unauthorized with token refresh mechanism
    if (response.status === 401 && isClient() && !path.includes("/api/accounts/login/") && !path.includes("/api/accounts/token/refresh/")) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const newAccessToken = await performTokenRefresh(refreshToken);
            localStorage.setItem("access_token", newAccessToken);
            isRefreshing = false;
            onRefreshed(newAccessToken);
          } catch (refreshErr) {
            isRefreshing = false;
            // Clear storage and notify about session expiration
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user_info");
            
            if (isClient()) {
              window.dispatchEvent(new CustomEvent(AUTH_SESSION_EXPIRED_EVENT));
            }
            throw new ApiError(401, { detail: "Your session has expired. Please log in again." });
          }
        }

        // Return a promise that resolves when the token refresh is complete
        return new Promise<T>((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            const newHeaders = new Headers(options.headers);
            newHeaders.set("Authorization", `Bearer ${newToken}`);
            if (!newHeaders.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
              newHeaders.set("Content-Type", "application/json");
            }
            
            fetch(url, { ...options, headers: newHeaders })
              .then(async (retryRes) => {
                if (retryRes.ok) {
                  if (retryRes.status === 204) {
                    resolve({} as T);
                  } else {
                    resolve(await retryRes.json());
                  }
                } else {
                  const errorData = await retryRes.json().catch(() => ({}));
                  reject(new ApiError(retryRes.status, errorData));
                }
              })
              .catch((err) => reject(err));
          });
        });
      }
    }

    // Try parsing error details
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Fallback for network errors
    throw new ApiError(500, { detail: (error as Error).message || "Network request failed" });
  }
}
