type RoleLevel = 1 | 2 | 3;

const ROLE_HIERARCHY: Record<string, RoleLevel> = {
  SUPERADMIN: 3,
  SUPERVISOR: 2,
  EMPLOYEE: 1,
};

export const hasRequiredRole = (
  userRole: string | null | undefined,
  requiredRoles?: string[],
): boolean => {
  if (!userRole || !requiredRoles?.length) return false;
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  return requiredRoles.some(
    (role) => userLevel >= (ROLE_HIERARCHY[role] ?? 0),
  );
};
