/**
 * LoginFormFields - Username and password input fields
 * @param {string} email - Current email value
 * @param {string} password - Current password value
 * @param {Function} onEmailChange - Callback when email changes
 * @param {Function} onPasswordChange - Callback when password changes
 */
export const LoginFormFields = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}: {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}) => {
  return (
    <>
      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter email"
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
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter password"
          className="glass-input w-full"
          required
        />
      </div>
    </>
  );
};
