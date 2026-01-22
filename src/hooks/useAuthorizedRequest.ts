import { useAuth } from "../contexts/AuthContext";
import { ApiError, apiRequest } from "../services/api";

export const useAuthorizedRequest = () => {
  const { ensureValidAccessToken, refreshAccessToken, signOut } = useAuth();

  const request = async <T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> => {
    const token = await ensureValidAccessToken();
    if (!token) throw new Error("Not authenticated");

    try {
      return await apiRequest<T>(path, options, token);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
          signOut();
          throw err;
        }
        return apiRequest<T>(path, options, refreshed);
      }
      throw err;
    }
  };

  return { request };
};
