import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { refreshAccessToken as refreshTokenRequest } from "../services/auth";
import type { AuthContextValue, AuthPayload, AuthState } from "../types/auth";

const STORAGE_KEY = "hrdash-auth";

const defaultAuth: AuthState = {
  isAuthenticated: false,
  userRole: "",
  userName: "",
  userId: null,
  role: null,
  accessToken: null,
  refreshToken: null,
};

const parseJwtPayload = (token: string): { exp?: number } | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const decoded = atob(padded);
    return JSON.parse(decoded) as { exp?: number };
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string, skewSeconds: number = 30) => {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return nowSeconds >= payload.exp - skewSeconds;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hydrated = { ...defaultAuth, ...parsed };
        return {
          ...hydrated,
          isAuthenticated: Boolean(hydrated.accessToken),
        };
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return defaultAuth;
  });

  useEffect(() => {
    if (auth.accessToken || auth.refreshToken) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  const signIn = useCallback((payload: AuthPayload) => {
    setAuth({
      isAuthenticated: true,
      userRole: payload.userRole,
      userName: payload.userName,
      userId: payload.userId,
      role: payload.role,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    });
  }, []);

  const signOut = useCallback(() => {
    setAuth(defaultAuth);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!auth.refreshToken) return null;
    try {
      const response = await refreshTokenRequest(auth.refreshToken);
      setAuth((prev) => ({
        ...prev,
        accessToken: response.accessToken,
        isAuthenticated: true,
      }));
      return response.accessToken;
    } catch {
      signOut();
      return null;
    }
  }, [auth.refreshToken, signOut]);

  const ensureValidAccessToken = useCallback(async () => {
    if (!auth.accessToken) return null;
    if (!isTokenExpired(auth.accessToken)) return auth.accessToken;
    return refreshAccessToken();
  }, [auth.accessToken, refreshAccessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      signIn,
      signOut,
      ensureValidAccessToken,
      refreshAccessToken,
    }),
    [auth, ensureValidAccessToken, refreshAccessToken, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
