/**
 * LoginCard - Glass card container for login form
 * @param {React.ReactNode} children - Child components
 */
export const LoginCard = ({ children }) => {
  return (
    <div
      className="glass-card w-full max-w-md p-8 border shadow-glass"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(255, 255, 255, 0.2)",
      }}
    >
      {children}
    </div>
  );
};
