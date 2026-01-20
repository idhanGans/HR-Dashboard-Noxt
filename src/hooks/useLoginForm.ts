import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

/**
 * useLoginForm - Custom hook for login form state
 */
export const useLoginForm = (
  onLogin: (role: string, username: string) => void
) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("admin");
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
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
