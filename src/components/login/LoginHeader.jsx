/**
 * LoginHeader - Header section of the login page
 */
export const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <h1
        className="text-4xl font-bold mb-2"
        style={{
          background: "linear-gradient(90deg, #c0c0c0, #ffffff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        HR Dashboard
      </h1>
      <p style={{ color: "#9ca3af" }} className="text-sm">
        Modern HRIS Management System
      </p>
    </div>
  );
};
