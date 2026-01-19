import { Role } from "@/users/dto";

const roleHierarchy: Record<Role, number> = {
  [Role.SUPERADMIN]: 3,
  [Role.SUPERVISOR]: 2,
  [Role.EMPLOYEE]: 1,
};

export const hasRequiredRole = (
  userRole: Role,
  requiredRoles: Role[],
): boolean => {
  if (!requiredRoles.length) {
    return false;
  }

  const userRoleLevel = roleHierarchy[userRole] || 0;

  return requiredRoles.some((requiredRole) => {
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    return userRoleLevel >= requiredRoleLevel;
  });
};
