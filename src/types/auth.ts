// Auth types
export interface AuthState {
  isAuthenticated: boolean;
  userRole: "Administrator" | "Employee";
  userName: string;
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
  children: React.ReactNode;
}

export interface PublicRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

// Login props
export interface LoginProps {
  onLogin: (role?: string, userName?: string) => void;
}
