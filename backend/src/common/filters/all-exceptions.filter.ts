import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { LoggerService } from "@/common/logging";
import { getCorrelationId } from "@/common/correlation";

interface RequestWithUser extends Request {
  user?: {
    id?: number;
    organizationId?: number;
  };
}

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
  path: string;
  correlationId?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext("ExceptionFilter");
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithUser>();

    const status = this.getStatus(exception);
    const message = this.getMessage(exception);
    const stack = this.getStack(exception);
    const correlationId = getCorrelationId();

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(correlationId && { correlationId }),
    };

    // Determine log level based on status code
    // 4xx (except 500) = warn (client errors, expected)
    // 5xx = error (server errors, needs investigation)
    const isServerError = status >= 500;
    const isValidationError = status === 400 || status === 422;

    const logMeta = {
      type: "error",
      status_code: status,
      method: request.method,
      endpoint: `${request.method} ${request.url}`,
      ...(request.user?.id && { user_id: request.user.id }),
      ...(request.user?.organizationId && {
        tenant_id: request.user.organizationId,
      }),
      error_message: Array.isArray(message) ? message.join(", ") : message,
      ...(stack && { stack_trace: stack }),
    };

    if (isServerError) {
      // 5xx errors - definitely need investigation
      this.logger.logError(
        `Server error: ${request.method} ${request.url}`,
        exception instanceof Error ? exception : new Error(String(message)),
        logMeta,
      );
    } else if (isValidationError) {
      // Validation errors - expected, use warn
      this.logger.warnEvent(
        "validation_error",
        `Validation failed: ${request.method} ${request.url}`,
        logMeta,
      );
    } else if (status === 401 || status === 403) {
      // Auth errors - might indicate attack, use warn
      this.logger.warnEvent(
        "auth_error",
        `Auth failed: ${request.method} ${request.url}`,
        logMeta,
      );
    } else if (status === 404) {
      // Not found - could be normal or probe, use info level via warnEvent
      this.logger.warnEvent(
        "not_found",
        `Not found: ${request.method} ${request.url}`,
        logMeta,
      );
    } else {
      // Other 4xx errors
      this.logger.warnEvent(
        "client_error",
        `Client error: ${request.method} ${request.url}`,
        logMeta,
      );
    }

    response.status(status).json(errorResponse);
  }

  private getStatus(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private getMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === "string") {
        return response;
      }
      if (typeof response === "object" && response !== null) {
        const responseObj = response as Record<string, unknown>;
        if (Array.isArray(responseObj.message)) {
          return responseObj.message as string[];
        }
        if (typeof responseObj.message === "string") {
          return responseObj.message;
        }
      }
      return exception.message;
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return "Internal server error";
  }

  private getStack(exception: unknown): string | undefined {
    if (exception instanceof Error) {
      return exception.stack;
    }
    return undefined;
  }
}
