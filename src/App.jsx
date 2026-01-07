import { useEffect, useState } from "react";
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
  LeavePage,
  SettingsPage,
} from "./pages";
import { EmployeeProvider } from "./contexts/EmployeeContext";

const STORAGE_KEY = "hrdash-auth";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      isAuthenticated: false,
      userRole: "Administrator",
      userName: "John Doe",
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const handleLogin = (role = "admin", userName = "John Doe") => {
    setAuth({
      isAuthenticated: true,
      userRole: role === "employee" ? "Employee" : "Administrator",
      userName: userName || "John Doe",
    });
  };

  const handleLogout = () => {
    setAuth((prev) => ({ ...prev, isAuthenticated: false }));
  };

  const layoutProps = {
    onLogout: handleLogout,
    userName: auth.userName,
    userRole: auth.userRole,
  };

  return (
    <EmployeeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute isAuthenticated={auth.isAuthenticated}>
                <LoginPage onLogin={handleLogin} />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <DashboardPage {...layoutProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <AttendancePage {...layoutProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payroll"
            element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <PayrollPage {...layoutProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kpi"
            element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <KPIPage {...layoutProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <EmployeesPage {...layoutProps} />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/hiring"
            element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <HiringPage {...layoutProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leave"
            element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <LeavePage {...layoutProps} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
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
      </BrowserRouter>
    </EmployeeProvider>
  );
}

export default App;
