/**
 * Get initials from a full name
 * @param name - Full name string
 * @returns First letter of first two words, uppercase
 */
export const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
