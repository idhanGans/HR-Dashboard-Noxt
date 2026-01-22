import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import {
  LoginPage,
  DashboardPage,
  AttendancePage,
  PayrollPage,
  KPIPage,
  EmployeesPage,
  HiringPage,
  SettingsPage,
} from "./pages";
import { EmployeeProvider } from "./contexts/EmployeeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import type { ProtectedRouteProps, PublicRouteProps } from "./types/auth";

const ProtectedRoute = ({
  isAuthenticated,
  children,
  allowedRoles,
  userRole,
}: ProtectedRouteProps) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({ isAuthenticated, children }: PublicRouteProps) => {
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { auth, signIn, signOut } = useAuth();

  const layoutProps = {
    onLogout: signOut,
    userName: auth.userName,
    userRole: auth.userRole,
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute isAuthenticated={auth.isAuthenticated}>
            <LoginPage onLogin={signIn} />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            userRole={auth.role}
          >
            <DashboardPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            userRole={auth.role}
          >
            <AttendancePage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payroll"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            userRole={auth.role}
          >
            <PayrollPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kpi"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            userRole={auth.role}
          >
            <KPIPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            userRole={auth.role}
          >
            <EmployeesPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hiring"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            userRole={auth.role}
          >
            <HiringPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            userRole={auth.role}
          >
            <SettingsPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <Navigate
            to={auth.isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            to={auth.isAuthenticated ? "/dashboard" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </EmployeeProvider>
    </AuthProvider>
  );
}

export default App;
