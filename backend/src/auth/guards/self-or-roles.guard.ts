import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  SELF_OR_ROLES_KEY,
  SelfOrRolesOptions,
} from "@/auth/decorators/roles.decorator";
import { UserPayload } from "@/auth/interfaces/user-payload.interface";
import { hasRequiredRole } from "@/auth/utils/role-utils";

@Injectable()
export class SelfOrRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const options = this.reflector.getAllAndOverride<SelfOrRolesOptions>(
      SELF_OR_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: UserPayload;
      params?: Record<string, string>;
    }>();
    const { user, params } = request;

    if (!user) {
      return false;
    }

    const paramValue = params?.[options.param];
    const paramId = Number(paramValue);
    const isSelf = !Number.isNaN(paramId) && paramId === user.id;

    if (isSelf) {
      return true;
    }

    return hasRequiredRole(user.role, options.roles);
  }
}
