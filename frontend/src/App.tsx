import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import {
  LoginPage,
  DashboardPage,
  AttendancePage,
  PayrollPage,
  KPIPage,
  NewKpiTrackerPage,
  EmployeesPage,
  OrganizationPage,
  HiringPage,
  ContactPage,
  SettingsPage,
} from "./pages";
import { EmployeeProvider } from "./contexts/EmployeeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { queryClient } from "./lib/queryClient";
import { hasRequiredRole } from "./utils/roles";
import type { ProtectedRouteProps, PublicRouteProps } from "./types/auth";

const LoadingScreen = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{
      background:
        "linear-gradient(135deg, #0f0f0f 0%, #2a2a2a 50%, #c0c0c0 100%)",
    }}
  >
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

const ProtectedRoute = ({
  isAuthenticated,
  isInitializing,
  children,
  allowedRoles,
  userRole,
}: ProtectedRouteProps) => {
  if (isInitializing) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !hasRequiredRole(userRole, allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const PublicRoute = ({
  isAuthenticated,
  isInitializing,
  children,
}: PublicRouteProps) => {
  if (isInitializing) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { auth, signIn, signOut } = useAuth();

  if (auth.isInitializing) {
    return <LoadingScreen />;
  }

  const layoutProps = {
    onLogout: signOut,
    userName: auth.userName,
    userRole: auth.role ?? "EMPLOYEE",
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute
            isAuthenticated={auth.isAuthenticated}
            isInitializing={auth.isInitializing}
          >
            <LoginPage onLogin={signIn} />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            isInitializing={auth.isInitializing}
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
            isInitializing={auth.isInitializing}
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
            isInitializing={auth.isInitializing}
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
            isInitializing={auth.isInitializing}
            userRole={auth.role}
            allowedRoles={["SUPERVISOR"]}
          >
            <KPIPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/kpi-tracker"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            isInitializing={auth.isInitializing}
            userRole={auth.role}
            allowedRoles={["SUPERVISOR"]}
          >
            <NewKpiTrackerPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            isInitializing={auth.isInitializing}
            userRole={auth.role}
            allowedRoles={["SUPERVISOR"]}
          >
            <EmployeesPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organization"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            isInitializing={auth.isInitializing}
            userRole={auth.role}
            allowedRoles={["SUPERVISOR"]}
          >
            <OrganizationPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hiring"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            isInitializing={auth.isInitializing}
            userRole={auth.role}
            allowedRoles={["SUPERVISOR"]}
          >
            <HiringPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contact"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            isInitializing={auth.isInitializing}
            userRole={auth.role}
            allowedRoles={["SUPERVISOR"]}
          >
            <ContactPage {...layoutProps} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            isInitializing={auth.isInitializing}
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EmployeeProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </EmployeeProvider>
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
