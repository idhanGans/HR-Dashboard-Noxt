import { interceptedAxios } from "../lib/axios";
import { AUTH_LOGIN, AUTH_PROFILE } from "./endpoints";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: string;
  position?: string;
}

export const login = async (email: string, password: string): Promise<AuthTokens> => {
  const response = await interceptedAxios.post<AuthTokens>(AUTH_LOGIN, {
    email,
    password,
  });
  return response.data;
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await interceptedAxios.get<UserProfile>(AUTH_PROFILE);
  return response.data;
};
