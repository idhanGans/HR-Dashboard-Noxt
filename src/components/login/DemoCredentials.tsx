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
        Username: <code>admin</code>
      </p>
      <p className="text-xs text-white">
        Password: <code>demo</code>
      </p>
    </div>
  );
};
