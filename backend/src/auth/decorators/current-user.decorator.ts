import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayload } from "@/auth/interfaces/user-payload.interface";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest<{ user: UserPayload }>();
    return request.user;
  },
);
