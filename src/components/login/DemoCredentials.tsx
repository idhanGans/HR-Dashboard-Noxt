/**
 * DemoCredentials - Display demo credentials info
 */
export const DemoCredentials = () => {
  return (
    <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
      <p className="text-xs text-lightGrey mb-2">
        <strong>Demo Credentials:</strong>
      </p>
      <p className="text-xs text-white">
        Superadmin: <code>superadmin@example.com</code>
      </p>
      <p className="text-xs text-white">
        Supervisor: <code>supervisor@example.com</code>
      </p>
      <p className="text-xs text-white">
        Employee: <code>employee@example.com</code>
      </p>
      <p className="text-xs text-white mt-2">
        Password: <code>password123</code>
      </p>
    </div>
  );
};
