import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * useLoginForm - Custom hook for login form state
 */
export const useLoginForm = (onLogin) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("admin");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(userRole, username);
      navigate("/dashboard");
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    userRole,
    setUserRole,
    handleLogin,
  };
};