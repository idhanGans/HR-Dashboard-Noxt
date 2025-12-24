import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components";

// Login page with glassmorphism design
export const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("admin");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(userRole);
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #0f0f0f 0%, #2a2a2a 50%, #c0c0c0 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Login Card */}
      <div
        className="glass-card w-full max-w-md p-8 border shadow-glass"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{
              background: "linear-gradient(90deg, #c0c0c0, #ffffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            HR Dashboard
          </h1>
          <p style={{ color: "#9ca3af" }} className="text-sm">
            Modern HRIS Management System
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="glass-input w-full"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="glass-input w-full"
              required
            />
          </div>

          {/* Role Toggle - Mock Only */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Login as
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setUserRole("admin")}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  userRole === "admin"
                    ? "bg-silver text-black font-semibold"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setUserRole("employee")}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  userRole === "employee"
                    ? "bg-silver text-black font-semibold"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                }`}
              >
                Employee
              </button>
            </div>
          </div>

          {/* Login Button */}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-xs text-lightGrey mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <p className="text-xs text-white">
            Username: <code>admin</code>
          </p>
          <p className="text-xs text-white">
            Password: <code>demo</code>
          </p>
        </div>
      </div>
    </div>
  );
};
