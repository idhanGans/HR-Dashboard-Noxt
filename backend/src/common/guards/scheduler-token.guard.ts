import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables, NodeEnvironment } from "@/config";

@Injectable()
export class SchedulerTokenGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
    }>();

    const expectedToken = this.configService.get("SCHEDULER_TOKEN", {
      infer: true,
    });

    if (!expectedToken) {
      const nodeEnv = this.configService.get("NODE_ENV", { infer: true });
      if (nodeEnv === NodeEnvironment.DEVELOPMENT) {
        return true;
      }

      throw new UnauthorizedException("Scheduler token is not configured");
    }

    const headerValue = request.headers["x-scheduler-token"];
    const providedToken = Array.isArray(headerValue)
      ? headerValue[0]
      : headerValue;

    if (!providedToken || providedToken !== expectedToken) {
      throw new UnauthorizedException("Invalid scheduler token");
    }

    return true;
  }
}
