/**
 * Avatar utility functions
 * Avatars are now stored on the backend via the useAvatar hook
 */

/**
 * Get initials from a name for avatar fallback
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a color based on a string (for avatar backgrounds)
 */
export function getAvatarColor(seed: string): string {
  const colors = [
    "from-blue-500 to-purple-600",
    "from-pink-500 to-red-600",
    "from-green-500 to-teal-600",
    "from-yellow-500 to-orange-600",
    "from-indigo-500 to-blue-600",
    "from-violet-500 to-purple-600",
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
