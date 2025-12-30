/**
 * LoginFormFields - Username and password input fields
 * @param {string} username - Current username value
 * @param {string} password - Current password value
 * @param {Function} onUsernameChange - Callback when username changes
 * @param {Function} onPasswordChange - Callback when password changes
 */
export const LoginFormFields = ({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
}) => {
  return (
    <>
      {/* Username Input */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
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
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter password"
          className="glass-input w-full"
          required
        />
      </div>
    </>
  );
};
