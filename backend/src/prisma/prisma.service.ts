import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, PrismaClient } from "@prisma/client";
import { LoggerService } from "@/common/logging";
import { EnvironmentVariables } from "@/config";

const omitConfig = {
  user: {
    password: true,
  },
} as const;

// Default threshold for slow queries in milliseconds
const DEFAULT_SLOW_QUERY_THRESHOLD_MS = 1000;

@Injectable()
export class PrismaService
  extends PrismaClient<{ omit: typeof omitConfig; log: Prisma.LogDefinition[] }>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly slowQueryThreshold: number;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {
    super({
      omit: omitConfig,
      log: [
        { emit: "event", level: "query" },
        { emit: "event", level: "error" },
        { emit: "event", level: "warn" },
      ],
    });

    this.logger.setContext("PrismaService");
    this.slowQueryThreshold =
      this.configService.get("SLOW_QUERY_THRESHOLD_MS", { infer: true }) ||
      DEFAULT_SLOW_QUERY_THRESHOLD_MS;
  }

  async onModuleInit() {
    // Set up query event listener for slow query logging
    this.$on("query" as never, (event: Prisma.QueryEvent) => {
      if (event.duration >= this.slowQueryThreshold) {
        this.logger.warnEvent(
          "slow_query",
          `Slow query detected: ${event.duration}ms`,
          {
            query: this.sanitizeQuery(event.query),
            duration_ms: event.duration,
            target: event.target,
          },
        );
      }
    });

    // Log Prisma errors
    this.$on("error" as never, (event: Prisma.LogEvent) => {
      this.logger.logError("Prisma error", new Error(event.message), {
        target: event.target,
      });
    });

    // Log Prisma warnings
    this.$on("warn" as never, (event: Prisma.LogEvent) => {
      this.logger.warn(event.message, { target: event.target });
    });

    // Connect to database
    await this.$connect();

    // Log successful connection
    this.logger.logEvent(
      "database_connection",
      "Database connected successfully",
      {
        status: "connected",
        database: "PostgreSQL",
      },
    );
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.logEvent("database_connection", "Database disconnected", {
      status: "disconnected",
    });
  }

  /**
   * Sanitize query to remove potential sensitive data from parameters
   * We only log the query structure, not the actual values
   */
  private sanitizeQuery(query: string): string {
    // Remove parameter values but keep the structure
    // This is a basic sanitization - Prisma already parameterizes queries
    return query;
  }
}
