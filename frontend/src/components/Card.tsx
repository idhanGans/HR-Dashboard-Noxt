import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

// Reusable Card component with glassmorphism effect
export const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div
      className={`glass-card transition-all duration-300 hover:border-white/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
