// Reusable Button component with gradient and hover effects
export const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const variants = {
    primary: "glass-button",
    secondary:
      "bg-white/10 border border-white/20 text-white hover:bg-white/20 px-6 py-2 rounded-lg transition-all",
    ghost: "text-white hover:text-silver transition-all",
  };

  return (
    <button
      className={`${variants[variant]} font-semibold transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
