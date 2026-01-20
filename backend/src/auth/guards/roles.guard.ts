import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@/auth/decorators/roles.decorator";
import { Role } from "@/users/dto";
import { UserPayload } from "@/auth/interfaces/user-payload.interface";
import { hasRequiredRole } from "@/auth/utils/role-utils";

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

    return hasRequiredRole(user.role, requiredRoles);
  }
}
