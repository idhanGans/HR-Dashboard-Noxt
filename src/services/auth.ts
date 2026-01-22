import { apiRequest } from "./api";
import { AUTH_LOGIN, AUTH_PROFILE, AUTH_REFRESH } from "./endpoints";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: string;
  roleName?: string;
}

export const login = (email: string, password: string) =>
  apiRequest<AuthTokens>(AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getProfile = (accessToken: string) =>
  apiRequest<UserProfile>(AUTH_PROFILE, { method: "GET" }, accessToken);

export const refreshAccessToken = (refreshToken: string) =>
  apiRequest<RefreshResponse>(AUTH_REFRESH, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
