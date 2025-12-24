// Reusable Card component with glassmorphism effect
export const Card = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`glass-card p-6 transition-all duration-300 hover:border-white/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
