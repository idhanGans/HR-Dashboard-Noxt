/**
 * Avatar storage and management utilities
 * Handles storing and retrieving avatar data from localStorage
 */

const AVATAR_STORAGE_KEY = "hrdash-user-avatar";
const EMPLOYEE_AVATARS_KEY = "hrdash-employee-avatars";

/**
 * Save user's main avatar to localStorage
 */
export function saveUserAvatar(avatarData: string): void {
  try {
    localStorage.setItem(AVATAR_STORAGE_KEY, avatarData);
  } catch (error) {
    console.error("Failed to save avatar:", error);
  }
}

/**
 * Get user's main avatar from localStorage
 */
export function getUserAvatar(): string | null {
  try {
    return localStorage.getItem(AVATAR_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to retrieve avatar:", error);
    return null;
  }
}

/**
 * Remove user's main avatar from localStorage
 */
export function removeUserAvatar(): void {
  try {
    localStorage.removeItem(AVATAR_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to remove avatar:", error);
  }
}

/**
 * Save employee avatar to localStorage
 * @param employeeId - ID of the employee
 * @param avatarData - Base64 encoded image data or URL
 */
export function saveEmployeeAvatar(
  employeeId: number,
  avatarData: string,
): void {
  try {
    const avatars = JSON.parse(
      localStorage.getItem(EMPLOYEE_AVATARS_KEY) || "{}",
    );
    avatars[employeeId] = avatarData;
    localStorage.setItem(EMPLOYEE_AVATARS_KEY, JSON.stringify(avatars));
  } catch (error) {
    console.error("Failed to save employee avatar:", error);
  }
}

/**
 * Get employee avatar from localStorage
 * @param employeeId - ID of the employee
 */
export function getEmployeeAvatar(employeeId: number): string | null {
  try {
    const avatars = JSON.parse(
      localStorage.getItem(EMPLOYEE_AVATARS_KEY) || "{}",
    );
    return avatars[employeeId] || null;
  } catch (error) {
    console.error("Failed to retrieve employee avatar:", error);
    return null;
  }
}

/**
 * Get all employee avatars
 */
export function getAllEmployeeAvatars(): Record<number, string> {
  try {
    return JSON.parse(localStorage.getItem(EMPLOYEE_AVATARS_KEY) || "{}");
  } catch (error) {
    console.error("Failed to retrieve employee avatars:", error);
    return {};
  }
}

/**
 * Remove employee avatar from localStorage
 * @param employeeId - ID of the employee
 */
export function removeEmployeeAvatar(employeeId: number): void {
  try {
    const avatars = JSON.parse(
      localStorage.getItem(EMPLOYEE_AVATARS_KEY) || "{}",
    );
    delete avatars[employeeId];
    localStorage.setItem(EMPLOYEE_AVATARS_KEY, JSON.stringify(avatars));
  } catch (error) {
    console.error("Failed to remove employee avatar:", error);
  }
}

/**
 * Clear all avatars from localStorage
 */
export function clearAllAvatars(): void {
  try {
    localStorage.removeItem(AVATAR_STORAGE_KEY);
    localStorage.removeItem(EMPLOYEE_AVATARS_KEY);
  } catch (error) {
    console.error("Failed to clear avatars:", error);
  }
}

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
