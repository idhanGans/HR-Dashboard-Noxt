import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login, getProfile } from "../services/auth";
import { setAccessToken } from "../lib/axios";
import { handleAxiosError } from "../lib/axios";
import type { AuthPayload } from "../types/auth";

/**
 * useLoginForm - Custom hook for login form state
 */
export const useLoginForm = (
  onLogin: (payload: AuthPayload) => void,
) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const tokens = await login(email.trim(), password);
      setAccessToken(tokens.accessToken);

      const profile = await getProfile();
      const roleLabels: Record<string, string> = {
        SUPERADMIN: "Administrator",
        SUPERVISOR: "Supervisor",
        EMPLOYEE: "Employee",
      };

      onLogin({
        refreshToken: tokens.refreshToken,
        userName: profile.fullName || profile.email,
        userRole: roleLabels[profile.role] ?? profile.role,
        userId: profile.id,
        role: profile.role,
      });

      navigate("/dashboard");
    } catch (err) {
      const message = handleAxiosError(err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleLogin,
  };
};
