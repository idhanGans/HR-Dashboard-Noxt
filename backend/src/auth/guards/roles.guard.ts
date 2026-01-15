import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";
import { UserPayload } from "@/auth/interfaces/user-payload.interface";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: UserPayload }>();
    const { user } = request;
    if (!user || !user.role) {
      return false;
    }

    return this.hasRequiredRole(user.role, requiredRoles);
  }

  private hasRequiredRole(userRole: Role, requiredRoles: Role[]): boolean {
    const roleHierarchy: Record<Role, number> = {
      [Role.SUPERADMIN]: 3,
      [Role.SUPERVISOR]: 2,
      [Role.EMPLOYEE]: 1,
    };

    const userRoleLevel = roleHierarchy[userRole] || 0;

    return requiredRoles.some((requiredRole) => {
      const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
      return userRoleLevel >= requiredRoleLevel;
    });
  }
}
