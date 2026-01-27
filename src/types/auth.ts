import type { ReactNode } from "react";

// Auth types
export interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  userRole: string;
  userName: string;
  userId: number | null;
  role: string | null;
}

export interface AuthPayload {
  refreshToken: string;
  userRole: string;
  userName: string;
  userId: number;
  role: string;
}

export interface AuthContextValue {
  auth: AuthState;
  signIn: (payload: AuthPayload) => void;
  signOut: () => void;
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
  isInitializing: boolean;
  allowedRoles?: string[];
  userRole?: string | null;
  children: ReactNode;
}

export interface PublicRouteProps {
  isAuthenticated: boolean;
  isInitializing: boolean;
  children: ReactNode;
}

// Login props
export interface LoginProps {
  onLogin: (payload: AuthPayload) => void;
}
