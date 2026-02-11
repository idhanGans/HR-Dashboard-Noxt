import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { Request, Response } from "express";
import { LoggerService } from "@/common/logging";
import { setCorrelationUserContext } from "@/common/correlation";

interface RequestWithUser extends Request {
  user?: {
    id?: number;
    organizationId?: number;
  };
  correlationId?: string;
}

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext("HTTP");
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== "http") {
      return next.handle();
    }

    const startTime = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<RequestWithUser>();
    const response = httpContext.getResponse<Response>();

    // Extract request info
    const method = request.method;
    const path = request.originalUrl || request.url;
    const ip = this.getClientIp(request);
    const userAgent = request.headers["user-agent"] || "unknown";

    // Set user context in correlation storage after auth guard runs
    // This will be available after the request is processed
    const setUserContext = () => {
      if (request.user) {
        setCorrelationUserContext(request.user.id, request.user.organizationId);
      }
    };

    return next.handle().pipe(
      tap((responseBody) => {
        setUserContext();
        const duration = Date.now() - startTime;
        const status = response.statusCode;

        this.logRequest({
          method,
          path,
          status,
          duration,
          ip,
          userAgent,
          userId: request.user?.id,
          tenantId: request.user?.organizationId,
          responseSize: this.getResponseSize(responseBody),
        });
      }),
      catchError((error) => {
        setUserContext();
        const duration = Date.now() - startTime;
        const status = this.getErrorStatus(error);

        this.logRequest({
          method,
          path,
          status,
          duration,
          ip,
          userAgent,
          userId: request.user?.id,
          tenantId: request.user?.organizationId,
          error: true,
        });

        throw error;
      }),
    );
  }

  private getErrorStatus(error: unknown): number {
    if (typeof error !== "object" || error === null) {
      return 500;
    }

    const errorWithStatus = error as {
      status?: unknown;
      statusCode?: unknown;
    };

    if (typeof errorWithStatus.status === "number") {
      return errorWithStatus.status;
    }

    if (typeof errorWithStatus.statusCode === "number") {
      return errorWithStatus.statusCode;
    }

    return 500;
  }

  private logRequest(data: {
    method: string;
    path: string;
    status: number;
    duration: number;
    ip: string;
    userAgent: string;
    userId?: number;
    tenantId?: number;
    responseSize?: number;
    error?: boolean;
  }): void {
    const message = `${data.method} ${data.path} ${data.status} ${data.duration}ms`;

    this.logger.logEvent("http_access", message, {
      method: data.method,
      path: data.path,
      status: data.status,
      duration_ms: data.duration,
      ip: data.ip,
      user_agent: data.userAgent,
      ...(data.userId && { user_id: data.userId }),
      ...(data.tenantId && { tenant_id: data.tenantId }),
      ...(data.responseSize !== undefined && {
        response_size: data.responseSize,
      }),
    });
  }

  private getClientIp(request: Request): string {
    // Check x-forwarded-for header first (for reverse proxies/load balancers)
    const forwardedFor = request.headers["x-forwarded-for"];
    if (forwardedFor) {
      // x-forwarded-for can contain multiple IPs, take the first one
      const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
      return ips.split(",")[0].trim();
    }

    // Check x-real-ip header
    const realIp = request.headers["x-real-ip"];
    if (realIp) {
      return Array.isArray(realIp) ? realIp[0] : realIp;
    }

    // Fall back to socket address
    return request.socket?.remoteAddress || request.ip || "unknown";
  }

  private getResponseSize(body: unknown): number | undefined {
    if (body === undefined || body === null) {
      return 0;
    }

    try {
      const json = JSON.stringify(body);
      return Buffer.byteLength(json, "utf8");
    } catch {
      return undefined;
    }
  }
}
