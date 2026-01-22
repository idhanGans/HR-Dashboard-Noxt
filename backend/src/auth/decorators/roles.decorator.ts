import { SetMetadata } from "@nestjs/common";
import { Role } from "@/users/dto";

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const SELF_OR_ROLES_KEY = "self_or_roles";

export interface SelfOrRolesOptions {
  param: string;
  roles: Role[];
}

export const SelfOrRoles = (param: string, ...roles: Role[]) =>
  SetMetadata(SELF_OR_ROLES_KEY, { param, roles });
