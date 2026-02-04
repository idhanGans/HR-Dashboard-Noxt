import { getInitials, getAvatarColor } from "../utils/avatarUtils";

interface AvatarDisplayProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
};

/**
 * AvatarDisplay - Reusable avatar component that displays image or initials fallback
 * Used across the dashboard for employee avatars
 */
export const AvatarDisplay = ({
  src,
  name,
  size = "md",
  className = "",
}: AvatarDisplayProps) => {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);
  const sizeClass = sizeMap[size];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover border-2 border-blue-400 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br ${bgColor} flex items-center justify-center text-white font-bold border-2 border-blue-400 ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};
