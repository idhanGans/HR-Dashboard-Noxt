import {
  Inject,
  Injectable,
  LoggerService as NestLoggerService,
} from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { getCorrelationId } from "@/common/correlation";

export interface LogContext {
  [key: string]: unknown;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Set the context (usually the class name) for subsequent logs
   */
  setContext(context: string): void {
    this.context = context;
  }

  /**
   * Create a child logger with a specific context
   */
  withContext(context: string): LoggerService {
    const childLogger = new LoggerService(this.logger);
    childLogger.setContext(context);
    return childLogger;
  }

  /**
   * Log at info level - for general informational messages
   */
  log(message: string, context?: string | LogContext): void {
    this.logInternal("info", message, context);
  }

  /**
   * Log at error level - for errors requiring investigation
   */
  error(
    message: string,
    traceOrContext?: string | LogContext,
    context?: string,
  ): void {
    if (typeof traceOrContext === "string" && context) {
      // NestJS format: error(message, trace, context)
      this.logger.error(message, {
        context: context,
        stack_trace: traceOrContext,
        correlation_id: getCorrelationId(),
      });
    } else if (typeof traceOrContext === "object") {
      this.logInternal("error", message, traceOrContext);
    } else {
      this.logInternal("error", message, traceOrContext);
    }
  }

  /**
   * Log at warn level - for unexpected but handled situations
   */
  warn(message: string, context?: string | LogContext): void {
    this.logInternal("warn", message, context);
  }

  /**
   * Log at debug level - for detailed debugging information
   */
  debug(message: string, context?: string | LogContext): void {
    this.logInternal("debug", message, context);
  }

  /**
   * Log at verbose level - for very detailed tracing
   */
  verbose(message: string, context?: string | LogContext): void {
    this.logInternal("verbose", message, context);
  }

  /**
   * Log at http level - specifically for HTTP access logs
   */
  http(message: string, meta?: LogContext): void {
    this.logger.log("http", message, {
      ...meta,
      context: this.context,
    });
  }

  /**
   * Log a business event with structured data
   */
  logEvent(type: string, message: string, meta?: LogContext): void {
    this.logger.info(message, {
      type,
      ...meta,
      context: this.context,
    });
  }

  /**
   * Log a business event at warn level
   */
  warnEvent(type: string, message: string, meta?: LogContext): void {
    this.logger.warn(message, {
      type,
      ...meta,
      context: this.context,
    });
  }

  /**
   * Log an error with full context
   */
  logError(message: string, error: Error, meta?: LogContext): void {
    this.logger.error(message, {
      type: "error",
      error_message: error.message,
      error_name: error.name,
      stack_trace: error.stack,
      ...meta,
      context: this.context,
    });
  }

  private logInternal(
    level: string,
    message: string,
    contextOrMeta?: string | LogContext,
  ): void {
    const meta: LogContext = {};

    if (typeof contextOrMeta === "string") {
      meta.context = contextOrMeta;
    } else if (contextOrMeta && typeof contextOrMeta === "object") {
      Object.assign(meta, contextOrMeta);
    }

    if (!meta.context && this.context) {
      meta.context = this.context;
    }

    this.logger.log(level, message, meta);
  }
}
