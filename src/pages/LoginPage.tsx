import { Button } from "../components";
import {
  LoginHeader,
  LoginFormFields,
  DemoCredentials,
  LoginCard,
} from "../components/login";
import { useLoginForm } from "../hooks/useLoginForm";
import type { FormEvent, ReactNode } from "react";
import type { LoginProps } from "../types/auth";

/**
 * LoginBackground - Background wrapper for login page
 */
const LoginBackground = ({ children }: { children: ReactNode }) => (
  <div
    className="min-h-screen flex items-center justify-center p-4"
    style={{
      background:
        "linear-gradient(135deg, #0f0f0f 0%, #2a2a2a 50%, #c0c0c0 100%)",
      minHeight: "100vh",
    }}
  >
    {children}
  </div>
);

/**
 * LoginForm - Main login form component
 */
const LoginForm = ({
  email,
  password,
  error,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: {
  email: string;
  password: string;
  error: string | null;
  isSubmitting: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <LoginFormFields
      email={email}
      password={password}
      onEmailChange={onEmailChange}
      onPasswordChange={onPasswordChange}
    />

    {error && (
      <p className="text-sm text-red-400" role="alert">
        {error}
      </p>
    )}

    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? "Signing in..." : "Login"}
    </Button>
  </form>
);

/**
 * LoginPage - Login page with glassmorphism design
 */
export const LoginPage = ({ onLogin }: LoginProps) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleLogin,
  } = useLoginForm(onLogin);

  return (
    <LoginBackground>
      <LoginCard>
        <LoginHeader />

        <LoginForm
          email={email}
          password={password}
          error={error}
          isSubmitting={isSubmitting}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
        />

        <DemoCredentials />
      </LoginCard>
    </LoginBackground>
  );
};
