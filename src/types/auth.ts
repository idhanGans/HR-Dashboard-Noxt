import type { ReactNode } from "react";

// Auth types
export interface AuthState {
  isAuthenticated: boolean;
  userRole: string;
  userName: string;
  role: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  userRole: string;
  userName: string;
  role: string;
}

export interface AuthContextValue {
  auth: AuthState;
  signIn: (payload: AuthPayload) => void;
  signOut: () => void;
  ensureValidAccessToken: () => Promise<string | null>;
  refreshAccessToken: () => Promise<string | null>;
}

// Layout props
export interface LayoutProps {
  onLogout: () => void;
  userName: string;
  userRole: string;
}

// Route component props
export interface ProtectedRouteProps {
  isAuthenticated: boolean;
  allowedRoles?: string[];
  userRole?: string | null;
  children: ReactNode;
}

export interface PublicRouteProps {
  isAuthenticated: boolean;
  children: ReactNode;
}

// Login props
export interface LoginProps {
  onLogin: (payload: AuthPayload) => void;
}
