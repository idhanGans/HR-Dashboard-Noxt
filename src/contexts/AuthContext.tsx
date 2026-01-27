import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  setRefreshToken,
  getRefreshToken,
  clearTokens,
} from "../lib/axios";
import { getProfile } from "../services/auth";
import type { AuthContextValue, AuthPayload, AuthState } from "../types/auth";

const defaultAuth: AuthState = {
  isAuthenticated: false,
  isInitializing: true,
  userRole: "",
  userName: "",
  userId: null,
  role: null,
};

const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: "Administrator",
  SUPERVISOR: "Supervisor",
  EMPLOYEE: "Employee",
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(defaultAuth);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        if (isMounted) {
          setAuth({ ...defaultAuth, isInitializing: false });
        }
        return;
      }

      try {
        const profile = await getProfile();

        if (isMounted) {
          setAuth({
            isAuthenticated: true,
            isInitializing: false,
            userRole: ROLE_LABELS[profile.role] ?? profile.role,
            userName: profile.fullName || profile.email,
            userId: profile.id,
            role: profile.role,
          });
        }
      } catch {
        clearTokens();
        if (isMounted) {
          setAuth({ ...defaultAuth, isInitializing: false });
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback((payload: AuthPayload) => {
    setRefreshToken(payload.refreshToken);
    setAuth({
      isAuthenticated: true,
      isInitializing: false,
      userRole: payload.userRole,
      userName: payload.userName,
      userId: payload.userId,
      role: payload.role,
    });
  }, []);

  const signOut = useCallback(() => {
    clearTokens();
    setAuth({ ...defaultAuth, isInitializing: false });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      signIn,
      signOut,
    }),
    [auth, signIn, signOut],
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
