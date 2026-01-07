import { Button } from "../components";
import {
  LoginHeader,
  LoginFormFields,
  RoleToggle,
  DemoCredentials,
  LoginCard,
} from "../components/login";
import { useLoginForm } from "../hooks/useLoginForm";

/**
 * LoginBackground - Background wrapper for login page
 */
const LoginBackground = ({ children }) => (
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
  username,
  password,
  userRole,
  onUsernameChange,
  onPasswordChange,
  onRoleChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <LoginFormFields
      username={username}
      password={password}
      onUsernameChange={onUsernameChange}
      onPasswordChange={onPasswordChange}
    />

    <RoleToggle selectedRole={userRole} onRoleChange={onRoleChange} />

    <Button type="submit" className="w-full">
      Login
    </Button>
  </form>
);

/**
 * LoginPage - Login page with glassmorphism design
 */
export const LoginPage = ({ onLogin }) => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    userRole,
    setUserRole,
    handleLogin,
  } = useLoginForm(onLogin);

  return (
    <LoginBackground>
      <LoginCard>
        <LoginHeader />

        <LoginForm
          username={username}
          password={password}
          userRole={userRole}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onRoleChange={setUserRole}
          onSubmit={handleLogin}
        />

        <DemoCredentials />
      </LoginCard>
    </LoginBackground>
  );
};
