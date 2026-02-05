import axios, { AxiosError, AxiosInstance } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { ApiResponseError, ApiError } from "../types/api/errors";
import { AUTH_REFRESH } from "../services/endpoints";

const REFRESH_TOKEN_KEY = "hrdash-refresh-token";

// Base URL for API calls (includes /api suffix)
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Backend base URL (without /api suffix) - used for serving static files
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;

const interceptedAxios: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const clearTokens = () => {
  setAccessToken(null);
  setRefreshToken(null);
};

const isTokenExpired = (token: string, bufferSeconds = 30): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now() + bufferSeconds * 1000;
  } catch {
    return true;
  }
};

const doRefresh = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"}${AUTH_REFRESH}`,
    { refreshToken }
  );
  
  const newAccessToken = response.data.accessToken;
  setAccessToken(newAccessToken);
  return newAccessToken;
};

// Proactive refresh in request interceptor - handles token before request goes out
interceptedAxios.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip auth endpoints to avoid infinite loops
    if (config.url?.includes("/auth/login") || config.url?.includes("/auth/refresh")) {
      return config;
    }

    let token = accessToken;
    const needsRefresh = !token || isTokenExpired(token);

    // No token or expired token? Refresh proactively if we have a refresh token
    if (needsRefresh && getRefreshToken()) {
      try {
        // Reuse existing refresh promise if one is in progress
        if (!refreshPromise) {
          refreshPromise = doRefresh();
        }
        token = await refreshPromise;
      } catch {
        // Refresh failed, let the request proceed without token
        // It will get a 401 which will be handled by response interceptor
      } finally {
        refreshPromise = null;
      }
    }

    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor as fallback for expired tokens (edge cases)
interceptedAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // For 401 errors on non-auth endpoints, clear tokens and reject
    // The proactive refresh should prevent most 401s, but this handles edge cases
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/auth/login") &&
      !error.config?.url?.includes("/auth/refresh")
    ) {
      clearTokens();
    }

    return Promise.reject(error);
  }
);

export const handleAxiosError = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data) {
    const responseData = error.response.data as ApiResponseError;
    if (Array.isArray(responseData.message)) {
      return responseData.message.join(", ");
    }
    if (typeof responseData.message === "string") {
      return responseData.message;
    }
    if (responseData.error) {
      return responseData.error;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "There was a problem with your request.";
};

export const createApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError && error.response) {
    return new ApiError(handleAxiosError(error), error.response.status);
  }
  return new ApiError(
    error instanceof Error ? error.message : "Unknown error",
    500
  );
};

export { interceptedAxios };
